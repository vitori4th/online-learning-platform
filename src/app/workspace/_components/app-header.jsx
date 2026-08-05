import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeftIcon, ListIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function AppHeader({ hideSidebar = false, backHref, title, onMenuClick }) {
    return (
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
                {!hideSidebar && <SidebarTrigger />}

                {backHref && (
                    <Link
                        href={backHref}
                        className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Voltar</span>
                    </Link>
                )}

                {title && (
                    <>
                        <Separator orientation="vertical" className="h-5" />
                        <h1 className="truncate text-sm font-semibold md:text-base">{title}</h1>
                    </>
                )}

                {onMenuClick && (
                    <Button variant="outline" size="sm" className="ml-1 md:hidden" onClick={onMenuClick}>
                        <ListIcon className="h-4 w-4" />
                        Capítulos
                    </Button>
                )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <ModeToggle />
                <UserButton />
            </div>
        </header>
    )
}

export default AppHeader;
