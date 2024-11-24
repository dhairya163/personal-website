const GOOD_RESUME_LATEX_EXAMPLE = `
\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[pdftex]{hyperref}
\\usepackage{fancyhdr}


\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.375in}
\\addtolength{\\evensidemargin}{-0.375in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[2]{
  \\item\\small{
    \\textbf{#1}{: #2 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeSubItem}[2]{\\resumeItem{#1}{#2}\\vspace{-4pt}}

\\renewcommand{\\labelitemii}{$\\circ$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  CV STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\\begin{document}

%----------HEADING-----------------
\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{\\href{http://sourabhbajaj.com/}{\\Large Sourabh Bajaj}} & Email : \\href{mailto:sourabh@sourabhbajaj.com}{mail@website.com}\\\\
  \\href{http://sourabhbajaj.com/}{http://www.sourabhbajaj.com} & Mobile : +1-123-456-7890 \\\\
\\end{tabular*}


%-----------EDUCATION-----------------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {Georgia Institute of Technology}{Atlanta, GA}
      {Master of Science in Computer Science;  GPA: 4.00}{Aug. 2012 -- Dec. 2013}
    \\resumeSubheading
      {Birla Institute of Technology and Science}{Pilani, India}
      {Bachelor of Engineering in Electrical and Electronics;  GPA: 3.66 (9.15/10.0)}{Aug. 2008 -- July. 2012}
  \\resumeSubHeadingListEnd


%-----------EXPERIENCE-----------------
\\section{Experience}
  \\resumeSubHeadingListStart

    \\resumeSubheading
      {Google}{Mountain View, CA}
      {Software Engineer}{Oct 2016 - Present}
      \\resumeItemListStart
        \\resumeItem{Tensorflow}
          {TensorFlow is an open source software library for numerical computation using data flow graphs; primarily used for training deep learning models.}
        \\resumeItem{Apache Beam}
          {Apache Beam is a unified model for defining both batch and streaming data-parallel processing pipelines, as well as a set of language-specific SDKs for constructing pipelines and runners.}
      \\resumeItemListEnd

    \\resumeSubheading
      {Coursera}{Mountain View, CA}
      {Senior Software Engineer}{Jan 2014 - Oct 2016}
      \\resumeItemListStart
        \\resumeItem{Notifications}
          {Service for sending email, push and in-app notifications. Involved in features such as delivery time optimization, tracking, queuing and A/B testing. Built an internal app to run batch campaigns for marketing etc.}
        \\resumeItem{Nostos}
          {Bulk data processing and injection service from Hadoop to Cassandra and provides a thin REST layer on top for serving offline computed data online.}
        \\resumeItem{Workflows}
          {Dataduct an open source workflow framework to create and manage data pipelines leveraging reusables patterns to expedite developer productivity.}
        \\resumeItem{Data Collection}
          {Designed the internal survey and crowd sourcing platfowm which allowed for creating various tasks for crowd sourding or embedding surveys across the Coursera platform.}
        \\resumeItem{Dev Environment}
          {Analytics environment based on docker and AWS, standardized the python and R dependencies. Wrote the core libraries that are shared by all data scientists.}
        \\resumeItem{Data Warehousing}
          {Setup, schema design and management of Amazon Redshift. Built an internal app for access to the data using a web interface. Dataduct integration for daily ETL injection into Redshift.}
        \\resumeItem{Recommendations}
          {Core service for all recommendation systems at Coursesa, currently used on the homepage and throughout the content discovery process. Worked on both offline training and online serving.}
        \\resumeItem{Content Discovery}
          {Improved content discovery by building a new onboarding experience on coursera. Using this to personalize the search and browse experience. Also worked on ranking and indexing improvements.}
        \\resumeItem{Course Dashboards}
          {Instructor dashboards and learner surveying tools, which helped instructors run their class better by providing data on Assignments and Learner Activity.}
      \\resumeItemListEnd

    \\resumeSubheading
      {Lucena Research}{Atlanta, GA}
      {Data Scientist}{Summer 2012 and 2013}
      \\resumeItemListStart
        \\resumeItem{Portfolio Management}
          {Created models for portfolio hedging,  portfolio optimization and price forecasting. Also creating a strategy backtesting engine used for simulating and backtesting strategies.}
        \\resumeItem{QuantDesk}
          {Python backend for a web application used by hedge fund managers for portfolio management.}
      \\resumeItemListEnd

  \\resumeSubHeadingListEnd


%-----------PROJECTS-----------------
\\section{Projects}
  \\resumeSubHeadingListStart
    \\resumeSubItem{QuantSoftware Toolkit}
      {Open source python library for financial data analysis and machine learning for finance.}
    \\resumeSubItem{Github Visualization}
      {Data Visualization of Git Log data using D3 to analyze project trends over time.}
    \\resumeSubItem{Recommendation System}
      {Music and Movie recommender systems using collaborative filtering on public datasets.}
%     \\resumeSubItem{Mac Setup}
%       {Book that gives step by step instructions on setting up developer environment on Mac OS.}
  \\resumeSubHeadingListEnd

%
%--------PROGRAMMING SKILLS------------
\\section{Programming Skills}
 \\resumeSubHeadingListStart
   \\item{
     \\textbf{Languages}{: Scala, Python, Javascript, C++, SQL, Java}
     \\hfill
     \\textbf{Technologies}{: AWS, Play, React, Kafka, GCE}
   }
 \\resumeSubHeadingListEnd


%-------------------------------------------
\\end{document}
`

const USER_PROMPT = `
You are tasked with creating a professional resume in LaTeX format based on a user's LinkedIn profile data. You will be provided with a good resume LaTeX example and the user's LinkedIn profile information. Your goal is to create a high-quality resume that will perform well in Applicant Tracking Systems (ATS) and catch the attention of hiring recruiters.

First, examine the following LaTeX resume example:

<resume_example>
{{RESUME_LATEX_EXAMPLE}}
</resume_example>

Now, carefully review the user's LinkedIn profile data:

<linkedin_data>
{{LINKEDIN_PROFILE_DATA}}
</linkedin_data>

To complete this task, follow these steps:

1. Analyze the example resume:
   - Note the overall structure and formatting
   - Identify key sections (e.g., contact information, summary, experience, education, skills)
   - Observe how information is presented within each section

2. Create a personalized message for the user:
   - Craft a brief, engaging message based on the user's LinkedIn data (start with , Hey {user's name} ...)
   - Mention key aspects of their profile (e.g., current role, years of experience, notable achievements)
   - Explain that their resume is being created and will be optimized for ATS
   - This should say that we are creating a resume, would take few seconds
   - Store this message in a variable called 'personalized_message'

3. Create the resume LaTeX code:
   - Use the same overall structure as the example resume
   - Include all relevant information from the LinkedIn profile
   - Ensure proper formatting and use of LaTeX commands
   - Incorporate appropriate keywords from the user's industry and skills
   - Highlight key achievements and responsibilities
   - Maintain a clean, professional layout
   - Store the complete LaTeX code in a variable called 'resume_latex'

4. Format the output as XML:
   - Return XML with two tags: "message" and "resume_latex"
   - Assign the 'personalized_message' to the "message" tag
   - Assign the 'resume_latex' to the "resume_latex" tag

Your final output should be a valid XML containing the personalized message and the complete LaTeX code for the resume. Ensure that all LaTeX commands and formatting are preserved in the XML tag. Make sure the latex is valid and properly formatted

use the almost similar latex code as provided in example, with slight modification as needed according to user's linkedin profile data. make sure the formatting is very good and is should have correct target keywords for getting a good ATS score.
`

function getResumeBuilderPrompt(linkedinProfileData: string) {
    return {
        "stream": true,
        "model": "anthropic/claude-3.5-sonnet-20240620",
        "messages": [
            {
                "role": "user",
                "content": USER_PROMPT.replace("{{RESUME_LATEX_EXAMPLE}}", GOOD_RESUME_LATEX_EXAMPLE).replace("{{LINKEDIN_PROFILE_DATA}}", linkedinProfileData)
            }
        ],
        "temperature": 0.2,
    };
}

export default getResumeBuilderPrompt;
