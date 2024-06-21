import path from "path";
import fs from "fs";
import matter from "gray-matter";
import readingTime from "reading-time";

export const getPostsData = () => {
    const postsDirectory = path.join(process.cwd(), 'posts')
    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames.map((fileName: any) => {
        // 这里匹配 md 或者 mdx
        const id = fileName.replace(/\.mdx?$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)
        return {
            id,
            ...matterResult.data,
            content: matterResult.content,
            stats: readingTime(matterResult.content)
        }
    }).filter((post: any) => !post.draft)
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const getTagsData = () => {
    return getPostsData().reduce((acc: any, post: any) => {
        post.tags.forEach((tag: any) => {
            if (!acc[tag]) {
                acc[tag] = 0
            }
            acc[tag]++
        })
        return acc
    }, {})
}