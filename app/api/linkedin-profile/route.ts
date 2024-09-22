import { NextRequest, NextResponse } from 'next/server';
import getResumeBuilderPrompt from './prompts';

async function verifyRecaptcha(token: string) {
  const apiKey = process.env.RECAPTCHA_SECRET_KEY;
  const siteKey = '6Lfq4koqAAAAAIbgxMqVFYKGYVthnJWWl4ftp2g7';
  const verifyUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/dhairya-ai-1726923165837/assessments?key=${apiKey}`;

  const requestBody = {
    event: {
      token: token,
      siteKey: siteKey,
    }
  };

  const response = await fetch(verifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();
  return data.tokenProperties?.valid && data.riskAnalysis?.score >= 0.1;
}

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  const recaptchaToken = request.nextUrl.searchParams.get('recaptchaToken');
  
  if (!url) {
    return NextResponse.json({ error: 'LinkedIn profile URL is required' }, { status: 400 });
  }

  if (!url.includes('linkedin.com/in')) {
    return NextResponse.json({ error: 'Invalid LinkedIn profile URL' }, { status: 400 });
  }

  if (!recaptchaToken) {
    return NextResponse.json({ error: 'reCAPTCHA token is required' }, { status: 400 });
  }

  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const writeToStream = async (text: string) => {
    await writer.write(encoder.encode(text));
  };

  const fetchLinkedInData = async () => {
    try {
      await writeToStream('event: update\ndata: {"message": "Fetching LinkedIn profile data..."}\n\n');

      const cleanUrl = new URL(url).origin + new URL(url).pathname;
      const response = await fetch(`https://linkedin-api8.p.rapidapi.com/get-profile-data-by-url?url=${encodeURIComponent(cleanUrl)}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': process.env.RAPIDAPI_HOST || '',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY || ''
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn data');
      }

      const data = await response.json();
      await writeToStream('event: update\ndata: {"message": "LinkedIn profile data fetched successfully"}\n\n');

      // Generate resume using OpenRouter API
      await writeToStream('event: update\ndata: {"message": "Understanding your profile..."}\n\n');
      const resumeResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": `${process.env.YOUR_SITE_URL}`,
          "X-Title": `${process.env.YOUR_SITE_NAME}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(getResumeBuilderPrompt(JSON.stringify(data)))
      });

      if (!resumeResponse.ok) {
        throw new Error('Failed to generate resume');
      }

      const reader = resumeResponse.body?.getReader();
      const decoder = new TextDecoder();

      let receivedResponse = '';
      let messageReceived = false;

      if (reader) {
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() === '') continue;
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6);
              try {
                const parsedData = JSON.parse(jsonStr);
                if (parsedData.choices && parsedData.choices[0].delta && parsedData.choices[0].delta.content) {
                  receivedResponse += parsedData.choices[0].delta.content;
                  
                  // Check if we've received the message and haven't sent it yet
                  if (!messageReceived && receivedResponse.includes('</message>')) {
                    const messageMatch = receivedResponse.match(/<message>([\s\S]*?)<\/message>/);
                    if (messageMatch) {
                      const message = messageMatch[1].trim();
                      await writeToStream(`event: update\ndata: ${JSON.stringify({ message })}\n\n`);
                      messageReceived = true;
                      await writeToStream('event: update\ndata: {"message": "Generating resume..."}\n\n');
                    }
                  }
                }
              } catch (error) {
                console.error('Error parsing JSON:', error);
              }
            } else {
              console.log('Non-data line:', line);
            }
          }
        }
      }

      // Extract LaTeX content
      const resume_latex_match = receivedResponse.match(/<resume_latex>([\s\S]*?)<\/resume_latex>/);
      const resume_latex = resume_latex_match ? resume_latex_match[1].trim() : '';

      // Send the complete resume
      await writeToStream(`event: completeResume\ndata: ${JSON.stringify({ resume_latex })}\n\n`);
      await writeToStream('event: done\ndata: {"message": "Resume generated successfully"}\n\n');
    } catch (error: any) {
      await writeToStream(`event: error\ndata: {"message": "Error: ${error.message}"}\n\n`);
    } finally {
      writer.close();
    }
  };

  fetchLinkedInData();

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

