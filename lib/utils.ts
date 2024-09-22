import { blogConfig } from "@/blog.config"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Metadata } from 'next'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getMetadata = (type: string) => {
    if (type === 'linkedin-profile-to-resume') {
        return getLinkedInToResumeMetadata()
    }
    const {title} = blogConfig
    return {
        title: `${blogConfig[type].title}- ${title}`,
        description: blogConfig[type].description,
    }
}

export const getLinkedInToResumeMetadata = (): Metadata => {
  return {
    title: 'Free LinkedIn Profile to Resume Generator',
    description: 'Convert your LinkedIn profile to a professional ready to use resume instantly using AI. Free online tool to generate a resume from your LinkedIn URL. No sign-up required.',
    openGraph: {
      title: 'LinkedIn Profile to Resume Generator | AI Resume Generator',
      description: 'Convert your LinkedIn profile to a professional ready to use resume instantly using AI. Free online tool to generate a resume from your LinkedIn URL.',
      type: 'website',
      url: 'https://dhairya.ai/tools/linkedin-profile-to-resume',
    },
  }
}