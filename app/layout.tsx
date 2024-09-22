import dynamic from 'next/dynamic'
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import {blogConfig} from "@/blog.config";
import Title from "@/components/title";
import Footer from "@/components/footer";
import BackToTop from "@/components/back-to-top";
import Analytics from "@/plugins/analytics";
import { Toaster } from "@/components/ui/toast"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from 'react';

const ProviderTheme = dynamic(() => import('@/provider/provider-theme'), { ssr: false })
const MixpanelTracker = dynamic(() => import('@/components/mixpanel-tracker'), { ssr: false });

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "AI Resume Generator",
    description: "Generate professional resumes from LinkedIn profiles using AI",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={'relative min-h-screen font-mono flex flex-col justify-between'}>
                <ProviderTheme>
                    <div className={'flex-1'}>
                        <Header/>
                        <main className={'md:mb-12 mb-8 min-w-full prose md:prose-lg dark:prose-invert'}>
                            <Title/>
                            {children}
                        </main>
                    </div>
                    <Footer/>
                    <BackToTop/>
                    <Analytics/>
                    <Toaster />
                    <SpeedInsights />
                    <Suspense fallback={null}>
                        <MixpanelTracker pageName="Layout" />
                    </Suspense>
                </ProviderTheme>
            </body>
        </html>
    );
}
