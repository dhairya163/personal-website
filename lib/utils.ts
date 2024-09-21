import { blogConfig } from "@/blog.config"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getMetadata = (type: string) => {
    const {title} = blogConfig
    return {
        title: `${blogConfig[type].title}- ${title}`,
        description: blogConfig[type].description,
    }
}