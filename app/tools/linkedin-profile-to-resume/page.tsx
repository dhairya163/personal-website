'use client'

import PageContainer from "@/components/page-container";
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Download, Eye, Linkedin, ChevronRight, Sparkles, CheckCircle, Copy } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Script from 'next/script'
import { getLinkedInToResumeMetadata } from '@/lib/utils'
import type { Metadata } from "next";
import mixpanel from 'mixpanel-browser';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function LinkedInProfileToResume() {
    const [url, setUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [pdfUrl, setPdfUrl] = useState('')
    const [step, setStep] = useState(0)
    const [profileData, setProfileData] = useState(null)
    const [updates, setUpdates] = useState<string[]>([])
    const [progress, setProgress] = useState(0)
    const abortControllerRef = useRef<AbortController | null>(null);
    const { toast } = useToast();
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const metadata = getLinkedInToResumeMetadata()

    useEffect(() => {
        // Load reCAPTCHA script
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validate the URL
        if (!url.includes('linkedin.com/in')) {
            toast({
                title: "Invalid URL",
                description: "Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true)
        setStep(1)
        setProfileData(null)
        setUpdates([])

        // Send Mixpanel event
        mixpanel.track('resume_generation_clicked', {
            linkedin_profile_url: url
        });

        try {
            // Execute reCAPTCHA and wait for the token
            const token = await new Promise<string>((resolve) => {
                window.grecaptcha.ready(() => {
                    window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' })
                        .then(resolve);
                });
            });

            abortControllerRef.current = new AbortController()
            const signal = abortControllerRef.current.signal

            const response = await fetch(`/api/linkedin-profile?url=${encodeURIComponent(url)}&recaptchaToken=${token}`, { signal })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const reader = response.body?.getReader()
            const decoder = new TextDecoder()

            while (true) {
                const { done, value } = await reader!.read()
                if (done) break

                const chunk = decoder.decode(value)
                const events = chunk.split('\n\n').filter(Boolean)

                for (const event of events) {
                    const [eventType, eventData] = event.split('\n')
                    const type = eventType.replace('event: ', '')
                    const data = JSON.parse(eventData.replace('data: ', ''))

                    switch (type) {
                        case 'update':
                            setUpdates(prev => [...prev, data.message])
                            setProgress(prev => Math.min(prev + 20, 90)) // Increment progress
                            break
                        case 'completeResume':
                            setProfileData(data)
                            setStep(2)
                            break
                        case 'done':
                            setStep(2)
                            break
                        case 'error':
                            throw new Error(data.message)
                    }
                }

                // setProgress(100) // Set to 100% when done
            }

            // Simulating PDF generation (replace this with actual PDF generation logic)
            await new Promise(resolve => setTimeout(resolve, 2000))
            setPdfUrl('/placeholder.pdf')
        } catch (error: any) {
            console.error('Error:', error)
            toast({
                title: "Error",
                description: error.message || "An unexpected error occurred. Please try again.",
                variant: "destructive",
            })
            setStep(0)
        } finally {
            setIsLoading(false)
        }
    }

    const steps = [
        { title: 'Paste URL', icon: Linkedin },
        { title: 'Generate', icon: Loader2 },
        { title: 'Download', icon: Download },
    ]

    const resetAndGenerateNew = () => {
        setStep(0);
        setUrl('');
        setPdfUrl('');
        setProfileData(null);
        setUpdates([]);
        setProgress(0);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: "Copied!",
                description: "LaTeX code copied to clipboard",
            });
        });
    };

    const downloadResume = async (isViewing: boolean = false) => {
        try {
            const response = await fetch('https://latex-compiler-787411786672.us-central1.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latex: ((profileData as { resume_latex: string } | null)?.resume_latex) ?? ''
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            if (isViewing) {
                return url;
            } else {
                const link = document.createElement('a');
                link.href = url;
                link.download = 'resume.pdf';
                link.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            toast({
                title: "Error",
                description: "Failed to download the resume. Please try again.",
                variant: "destructive",
            });
            return null;
        }
    };

    const viewResume = async () => {
        setViewLoading(true);
        const pdfUrl = await downloadResume(true);
        if (pdfUrl) {
            setPdfUrl(pdfUrl);
            setIsPdfModalOpen(true);
        }
        setViewLoading(false);
    };

    const handleDownload = async () => {
        setDownloadLoading(true);
        await downloadResume(false);
        setDownloadLoading(false);
    };

    return (
        <PageContainer>
            <Script id="linkedin-to-resume-schema" type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebApplication",
                    "name": metadata.title,
                    "description": metadata.description,
                    "url": metadata.openGraph?.url,
                    "applicationCategory": "BusinessApplication",
                    "operatingSystem": "All",
                    "offers": {
                        "@type": "Offer",
                        "price": "0"
                    }
                })}
            </Script>
            <Card className="w-full max-w-4xl mx-auto relative overflow-hidden">
                <motion.div
                    className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: (step + 1) / 3 }}
                    transition={{ duration: 0.5 }}
                />
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Free LinkedIn Profile to Resume Generator</CardTitle>
                    <CardDescription className="text-center">Convert your LinkedIn profile to a resume</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between mb-8">
                        {steps.map((s, i) => (
                            <motion.div
                                key={i}
                                className={`flex flex-col items-center ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}
                                animate={{ scale: i === step ? 1.1 : 1 }}
                            >
                                <div className="rounded-full bg-secondary p-2 mb-2">
                                    {i === 1 && isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <s.icon className="h-6 w-6" />
                                    )}
                                </div>
                                <span className="text-sm">{s.title}</span>
                            </motion.div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {step < 2 && (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="relative">
                                        <Input
                                            type="url"
                                            placeholder="Paste your LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="pl-12 pr-4 py-2 w-full"
                                        />
                                        <Linkedin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {step === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !url}
                                        className="w-full py-6 text-lg"
                                    >
                                        Generate Resume <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                    <AnimatePresence>
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="mt-6 space-y-4"
                            >
                                <Progress value={progress} className="w-full" />
                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                                    <h3 className="font-semibold mb-2 dark:text-gray-200">Progress Updates:</h3>
                                    <ul className="space-y-2">
                                        {updates.map((update, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                className="flex items-center dark:text-gray-300"
                                            >
                                                {index === updates.length - 1 ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-500" />
                                                ) : (
                                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                                )}
                                                <span>{update}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                        {profileData && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mt-6"
                            >
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                                    <div className="sticky top-0 bg-gray-200 dark:bg-gray-700 py-0.5 px-2 flex justify-between items-center">
                                        <h4 className="font-semibold !mt-2 pl-3 dark:text-gray-200">LaTeX Code for Your Resume:</h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard((profileData as { resume_latex: string }).resume_latex)}
                                        >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy
                                        </Button>
                                    </div>
                                    <div className="p-4 max-h-60 overflow-auto">
                                        <pre className="text-sm !mt-0 dark:text-gray-300">
                                            {(profileData as { resume_latex: string }).resume_latex}
                                        </pre>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mt-6 space-y-4"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        onClick={viewResume}
                                        className="w-full relative overflow-hidden"
                                        variant="outline"
                                        disabled={viewLoading}
                                    >
                                        <motion.div
                                            initial={false}
                                            animate={viewLoading ? { width: "100%" } : { width: "0%" }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute left-0 top-0 bottom-0 bg-primary/20"
                                        />
                                        {viewLoading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Loader2 className="mr-2 h-4 w-4" />
                                            </motion.div>
                                        ) : (
                                            <Eye className="mr-2 h-4 w-4" />
                                        )}
                                        View Resume
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        onClick={handleDownload}
                                        className="w-full relative overflow-hidden"
                                        variant="outline"
                                        disabled={downloadLoading}
                                    >
                                        <motion.div
                                            initial={false}
                                            animate={downloadLoading ? { width: "100%" } : { width: "0%" }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute left-0 top-0 bottom-0 bg-primary/20"
                                        />
                                        {downloadLoading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Loader2 className="mr-2 h-4 w-4" />
                                            </motion.div>
                                        ) : (
                                            <Download className="mr-2 h-4 w-4" />
                                        )}
                                        Download Resume
                                    </Button>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex justify-between items-center"
                                >
                                    <Button
                                        onClick={resetAndGenerateNew}
                                        variant="ghost"
                                        className="text-sm text-muted-foreground hover:text-primary"
                                    >
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Create for a different profile
                                    </Button>
                                    
                                    <Button
                                        onClick={() => window.open('https://socialsonic.com/?via=dhairya', '_blank')}
                                        variant="ghost"
                                        className="h-full group relative text-sm text-primary transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 bg-[length:200%] hover:bg-right animate-shimmer cursor-pointer p-3 rounded-lg border border-purple-500/20 hover:border-purple-500/40"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <div className="w-5 h-5">
                                            <img 
                                                src="https://www.google.com/s2/favicons?domain=socialsonic.com&sz=48"
                                                alt="Socialsonic" 
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    display: 'block',
                                                    flexShrink: 0,
                                                    objectFit: 'contain',
                                                    marginTop: '0px',
                                                }}
                                            />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold group-hover:underline">
                                                    🚀 10x Your LinkedIn Growth
                                                </span>
                                                <span className="text-xs text-blue-400/80">
                                                    Try SocialSonic For Free →
                                                </span>
                                            </div>
                                        </div>
                                    </Button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
                <motion.div
                    className="absolute top-4 right-4"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Sparkles className="text-yellow-500 h-6 w-6" />
                </motion.div>
            </Card>
            <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
                <DialogContent className="max-w-4xl w-full h-[80vh]">
                    <iframe src={pdfUrl} className="w-full h-full" />
                </DialogContent>
            </Dialog>
            <section className="!mt-24">
                <h2 className="text-2xl font-bold text-center mb-4">How My Tool Converts Your LinkedIn Profile to a Resume</h2>
                <p className="text-center mb-6">
                    I created this free LinkedIn Profile to Resume Generator to help you effortlessly convert your LinkedIn profile into a professional resume. 
                    Simply paste your LinkedIn profile URL, and my tool will handle the rest. No signup required, and it's always free to use.
                </p>
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Step-by-Step Process:</h3>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Paste your LinkedIn profile URL into the input field.</li>
                        <li>Click the "Generate Resume" button.</li>
                        <li>My tool will fetch your LinkedIn profile data and convert it into a resume format.</li>
                        <li>Once the resume is generated, you can view or download it as a PDF.</li>
                    </ol>
                </div>
            </section>
            <section className="mt-12">
                <h2 className="text-2xl font-bold text-center mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold">Is this tool really free?</h3>
                        <p>Yes, my LinkedIn Profile to Resume Generator is completely free to use. No signup or payment is required.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Do I need to create an account?</h3>
                        <p>No, you do not need to create an account to use my tool. Simply paste your LinkedIn profile URL and generate your resume.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Will this tool always be free?</h3>
                        <p>Yes, I am committed to keeping this tool free for everyone to use.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Is my data safe?</h3>
                        <p>Yes, I take your privacy seriously. Your LinkedIn profile data is only used to generate your resume and is not stored or shared.</p>
                    </div>
                </div>
            </section>
        </PageContainer>
    )
}
