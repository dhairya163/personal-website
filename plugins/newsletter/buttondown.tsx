import { Button } from "@/components/ui/button";
import { pluginConfig } from "@/blog.config";

const ButtonDown = () => {
    const { buttondown: { username } } = pluginConfig.newsletter;

    return (
        <form
            action={`https://buttondown.com/api/emails/embed-subscribe/${username}`}
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
    );
}

export default ButtonDown;