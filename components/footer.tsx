import {blogConfig, pluginConfig} from "@/blog.config";
import SocialList from "@/components/social-list";
import Link from "next/link";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import { Button } from './ui/button';

const Footer = () => {
    const {author, footer: {isShow, isShowPoweredBy}} = blogConfig
    const {title, description, position, buttondown} = pluginConfig.newsletter

    return (
        isShow && <div>
            <Separator/>
            <footer className={'container py-8 space-y-8'}>
                {position.footer &&
                    <div className={"flex justify-between items-center flex-col md:flex-row space-y-4 md:space-y-0"}>
                        <div className={"flex justify-center items-center md:items-start flex-col"}>
                            <Label className={'text-base'}>
                                {title}
                            </Label>
                            {description && <p className={"text-sm text-gray-500 text-center"}>{description}</p>}
                        </div>
                        <form
                            action={`https://buttondown.com/api/emails/embed-subscribe/${buttondown.username}`}
                            method="post"
                            target="_blank"
                            className="flex gap-2"
                        >
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="px-3 py-2 border rounded-md"
                                required
                            />
                            <input type="hidden" value="1" name="embed" />
                            <Button type="submit" className="px-4 py-2 bg-black text-white hover:bg-gray-800">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                }
                <div
                    className={'w-full flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0'}>
                    <div className={'md:hidden block'}>
                        <SocialList isFooter={true}/>
                    </div>
                    <div>
                        {`© ${new Date().getFullYear()} ${author}`}
                        {isShowPoweredBy &&
                            <span>,Powered by <Link
                                className={'font-bold hover:underline hover:underline-offset-4 cursor-pointer'}
                                href={'https://github.com/imyuanli/next-blog'}>NextBlog</Link>.
                            </span>
                        }
                    </div>
                    <div className={'md:block hidden'}>
                        <SocialList isFooter={true}/>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer