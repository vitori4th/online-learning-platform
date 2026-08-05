"use client"
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import React from "react";

function WelcomeBanner() {
    const { user } = useUser();

    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-primary p-6 text-primary-foreground md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-center gap-4">
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 sm:flex">
                    <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold md:text-2xl">
                        Bem-vindo{user?.firstName ? `, ${user.firstName}` : ""}!
                    </h2>
                    <p className="text-sm text-primary-foreground/80">
                        Aprenda, crie e explore seus cursos favoritos com a ajuda da IA.
                    </p>
                </div>
            </div>

            <Link href="/workspace/explore">
                <Button variant="secondary" size="lg">
                    Explorar cursos
                </Button>
            </Link>
        </div>
    )
}

export default WelcomeBanner;
