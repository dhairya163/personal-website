'use client'

import {pluginConfig} from "@/blog.config";
import {useEffect, useRef, useState} from "react";
import Utterances from "@/plugins/comments/utterances";
import Giscus from "@/plugins/comments/giscus";
import {useInViewport} from "ahooks";

// Define a type for the comment configuration
type CommentConfig = {
    engine: 'giscus' | 'utterances';
    giscus?: Record<string, any>;
    utterances?: Record<string, any>;
};

const Comments = () => {
    const {comment} = pluginConfig as { comment: CommentConfig };
    if (!comment?.engine) return null;
    const engine = comment.engine;

    const ref = useRef(null);
    const [show, setShow] = useState(false)
    const [inViewport] = useInViewport(ref);
    useEffect(() => {
        if (inViewport) {
            setShow(true)
        }
    }, [inViewport])

    return (
        <div ref={ref} id={"comment"}>
            {show &&
                <>
                    {engine === "giscus" && comment.giscus && <Giscus config={comment.giscus}/>}
                    {engine === "utterances" && comment.utterances && <Utterances config={comment.utterances}/>}
                </>
            }
        </div>
    )

};

export default Comments;