import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ href = "/", className, textClassName, iconOnly = false, plain = false }) {
    return (
        <Link href={href} className={cn("flex items-center gap-2.5", className)}>
            <span className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg p-1.5",
                !plain && "bg-white shadow-sm"
            )}>
                <Image
                    src="/logo.svg"
                    alt="EduGen"
                    width={60}
                    height={40}
                    className="h-full w-full object-contain"
                    priority
                />
            </span>
            {!iconOnly && (
                <span className={cn("text-lg font-bold tracking-tight", textClassName)}>
                    EduGen
                </span>
            )}
        </Link>
    );
}
