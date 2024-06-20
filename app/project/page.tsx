import ProjectContent from "@/components/project-content";
import type {Metadata} from "next";
import {getMetadata} from "@/lib/utils";

export const metadata: Metadata = getMetadata("project")

const Projects = () => {
    return (
        <ProjectContent/>
    )
}


export default Projects;