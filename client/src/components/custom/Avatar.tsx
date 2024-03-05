import { Avatar as AvatarMain, AvatarFallback } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { generateFallbackAvatar } from "@/lib/utils";
import Image from "next/image";

type Props = {
    size?: "sm" | "default" | "lg";
    src: string;
    name: string;
    email?: string;
    tooltip?: boolean;
};
export default function Avatar({
    src,
    name,
    email,
    size,
    tooltip = false,
}: Props) {
    switch (size) {
        case "sm":
            if (tooltip) {
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <AvatarMain className="my-auto h-8 w-8">
                                    <Image
                                        className="aspect-square h-full w-full"
                                        src={src}
                                        width={32}
                                        height={32}
                                        alt="Profile picture"
                                    />
                                    <AvatarFallback>
                                        {generateFallbackAvatar(name)}
                                    </AvatarFallback>
                                </AvatarMain>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{name}</p>
                                <small className="text-secondary">
                                    {email}
                                </small>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            } else {
                return (
                    <AvatarMain className="my-auto h-8 w-8">
                        <Image
                            className="aspect-square h-full w-full"
                            src={src}
                            width={32}
                            height={32}
                            alt="Profile picture"
                        />
                        <AvatarFallback>
                            {generateFallbackAvatar(name)}
                        </AvatarFallback>
                    </AvatarMain>
                );
            }
        case "lg":
            return (
                <AvatarMain className="my-auto h-36 w-36 border">
                    <Image
                        className="aspect-square h-full w-full"
                        src={src}
                        width={144}
                        height={144}
                        alt="Profile picture"
                    />
                    <AvatarFallback>
                        {generateFallbackAvatar(name)}
                    </AvatarFallback>
                </AvatarMain>
            );
        default:
            return (
                <AvatarMain>
                    <Image
                        className="aspect-square h-full w-full"
                        src={src}
                        width={32}
                        height={32}
                        alt="Profile picture"
                    />

                    <AvatarFallback>
                        {generateFallbackAvatar(name)}
                    </AvatarFallback>
                </AvatarMain>
            );
    }
}
