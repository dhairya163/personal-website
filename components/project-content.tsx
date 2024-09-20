'use client';

import Link from "next/link";
import {CardDescription, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Github} from "lucide-react";
import {blogConfig} from "@/blog.config";

export const GITHUB_URL = "https://github.com/"

const ProjectContent = () => {
    const {projects, getStatus} = blogConfig.project

    return (
        <>
            {projects.map((project: any, index: number): any => {
                const {variant, text}: any = getStatus(project.status)
                return (
                    <div className={'not-prose'} key={index}>
                        <div className={'flex items-center mb-2'}>
                            {project.href ?
                                <Link href={project.href} className={'underline underline-offset-4'}>
                                    <CardTitle>
                                        {project.name}
                                    </CardTitle>
                                </Link>
                                :
                                <CardTitle>
                                    {project.name}
                                </CardTitle>
                            }
                            {project.status && <Badge className={'ml-4'} variant={variant}>
                                {text}
                            </Badge>}
                            {project.github && <Button className={'ml-2'} variant={'ghost'} size={'icon'}>
                              <Link href={GITHUB_URL + project.github} target="_blank">
                                <Github size={20}/>
                              </Link>
                            </Button>}
                        </div>
                        <CardDescription className={'text-base'}>
                            {project.description}
                        </CardDescription>
                    </div>
                )
            })}
        </>
    );
}


export default ProjectContent