// Purpose: This file is used to configure the blog, including the author, title, description, and other settings.

import Intro from "./components/intro.mdx" // introduction or about me

// Page Config
// The following is the configuration of the blog, including the author, title, description, and other settings.
const blogConfig: any = {
    // author name
    author: "Dhairya Aggarwal",

    // Logo
    logo: {
        // how to change the favicon of the website?
        // change the app/favicon.ico file directly，or refer to the document below
        // https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons

        // you can use image or text as the logo, you can choose both, but the image will be displayed first
        image: "/logo.png", //  the file path of the logo in the public directory
        text: "NextBlog", // null || text

        // whether the logo is a link to the home page
        isHomeLink: true, // true | false
    },

    // website title
    title: "All about me",

    // website description
    description: "A blog about AI, LLMs, and cutting-edge software engineering.",

    // light | dark
    theme: "light",

    // your blog repo || your github repo || null
    githubRepo: "https://github.com/dhairya163/personal-website",

    // routes
    routes: [
        {
            name: 'Blog',
            value: '/blog'
        },
        {
            name: 'Projects',
            value: '/project'
        },
        {
            name: 'Tools',
            value: '/tools'
        },
    ],

    // socials links
    socials: {
        email: "dhairya.aggarwal@gmail.com",
        github: "https://github.com/dhairya163",
        linkedin: "https://www.linkedin.com/in/dhairya-aggarwal/",
        facebook: "",
        instagram: "",
        youtube: "",
    },

    // home page config
    home: {
        title: "Dhairya Aggarwal",
        description: "Turning coffee into code and dreams into AI reality. Join me on this wild tech ride!",
        hook: "From Institute Gold Medalist to AI trailblazer at Writesonic - join me on this exciting journey!",
        intro: Intro, // file path of the introduction
    },

    // blog page config
    blog: {
        title: 'AI & Tech Insights',
        description: 'Exploring AI, LLMs, and cutting-edge software engineering.',

        // pinnedSort is used to sort the pinned articles, the default is "desc" (descending)
        pinnedSort: "desc",
    },

    tools: {
        title: 'AI Tools',
        description: 'Some small tools made by oneself',
    },

    // tags page config
    tags: {
        title: 'Tags',
        description: 'All of my tags, collected in alphabetical order.',
    },

    // project page config
    project: {
        title: "Look what I've done",
        description: "Some small tools made by oneself",

        // status color and text
        getStatus: (status: string) => {
            // you can customize the status color and text！

            // dev: Under development or planning.
            // active: Currently focused on this project.
            // filed: Not upgrading will only fix bugs.
            // offline: Going offline soon.
            // none: Keep running.
            if (!status) return {}

            switch (status) {
                case "active":
                    return {
                        variant: "default",
                        text: "ACTIVE",
                    }
                case "dev":
                    return {
                        variant: "secondary",
                        text: "DEV",
                    }
                case "filed":
                    return {
                        variant: "outline",
                        text: "FILED",
                    }
                case "offline":
                    return {
                        variant: "destructive",
                        text: "OFFLINE",
                    }
            }
        },

        // name, description, href are required
        // github: username/repo
        // status: getStatus return value
        // and so on
        // you can add more fields according to your needs ,but you need to modify the code in the project/page.tsx file
        projects: [
            {
                name: "Personal Website",
                description: "A minimilistic website created with Next.js ,Shadcn-ui and Tailwind.css",
                href: "https://dhairya.ai",
                github: "dhairya163/personal-website",
                status: "active",
            },
        ],
    },

    // Footer
    footer: {
        isShow: true,
        // whether to display the "Powered by NextBlog" in the footer，you can set it to false，but I hope you can keep it，thank you！
        isShowPoweredBy: false,
    },
}

// Plugins Config
// Why define the following as plugins? Because these are some dispensable functions that can be added or removed at will.
const pluginConfig = {
    // Comment
    comment: {
        engine: "giscus", // "" | giscus | utterances

        // giscus doc: https://giscus.app
        // giscus: {
        //     repo: "imyuanli/next-blog",
        //     repoId: "R_kgDOKTZ_kQ",
        //     category: "Announcements",
        //     categoryId: "DIC_kwDOKTZ_kc4CfMXK",
        //     mapping: "pathname",
        //     reactionsEnabled: "1",
        //     emitMetadata: "0",
        //     inputPosition: "top",
        //     theme: "light",
        //     lang: "en",
        //     loading: "lazy",
        // },

        // // utterances doc: https://utteranc.es
        // utterances: {
        //     src: "https://utteranc.es/client.js",
        //     repo: "imyuanli/next-blog",
        //     "issue-term": "pathname",
        //     theme: "github-light",
        //     crossorigin: "anonymous",
        //     label: "",
        //     async: true
        // }
    },

    // Pagination
    pagination: {
        engine: "default", // "" | default:pagination button | loadMore:loading more button
        pageSize: 5,
    },

    // Search
    search: {
        engine: "cmdk", //  "" | "cmdk"
    },

    //   Analytics
    analytics: {
        engine: "vercel", // "" | "vercel"
        // vercel doc: https://vercel.com/docs/analytics
    },

    // newsletter
    newsletter: {
        engine: "buttondown", // "" | "buttondown"

        title: "Subscribe to the newsletter", // required
        description: "Stay updated on new releases and features, guides, and case studies.",

        position: {
            footer: true, // in the footer
            blog: true, // on the blog list page
        },

        // buttondown doc: https://buttondown.com
        buttondown: {
            username: "dhairya", //  your buttondown username
        },
    },
}

export {
    blogConfig,
    pluginConfig
}