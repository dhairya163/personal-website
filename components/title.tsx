'use client';

import {Separator} from "@/components/ui/separator";
import {usePathname, useSearchParams} from "next/navigation";
import siteData from "@/blog.config";
import Newsletter from "@/plugins/newsletter";


const Title = () => {
    const pathname = usePathname()
    const nameArr = pathname.split('/')
    const name = nameArr[nameArr.length - 1]

    const data = name ? siteData[name] : siteData.home

    // 如果是博客页面并带有tag参数
    const searchParams = useSearchParams()
    const tag = searchParams.get('tag')
    if (name === 'blog' || tag) {
        return <div className={'container pt-8'}>
            <h1>{tag ? tag : data?.title}</h1>
            {data?.description &&
                <p className={'text-zinc-600'}>
                    {tag ? "This is a list of all posts with the tag {tag}." :
                        data?.description}
                </p>
            }
            <p>
                <Newsletter/>
            </p>
            <Separator/>
        </div>
    }


    return (
        data && <div className={'container pt-8'}>
            <h1>{data?.title}</h1>
            {data?.description && <p className={'text-zinc-600'}>{data?.description}</p>}
            <Separator/>
        </div>
    );
}


export default Title