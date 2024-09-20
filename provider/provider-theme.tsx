'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { blogConfig } from "@/blog.config"

export default function ProviderTheme({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <>{children}</>
    }

    return (
        <ThemeProvider attribute="class" defaultTheme={blogConfig.theme}>
            {children}
        </ThemeProvider>
    )
}
