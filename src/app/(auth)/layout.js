import { GraduationCap } from "lucide-react";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }) {
    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            <div className="relative hidden flex-col items-center justify-center bg-primary p-10 text-primary-foreground lg:flex">
                <Logo href="/" className="absolute top-10 left-10" />

                <div className="max-w-sm text-center">
                    <GraduationCap className="mx-auto mb-4 h-12 w-12 text-primary-foreground/80" />
                    <h2 className="text-xl font-bold">Aprenda qualquer coisa, do jeito certo.</h2>
                    <p className="mt-2 text-primary-foreground/80">
                        Cursos personalizados gerados por IA para acelerar o seu aprendizado.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center p-6">
                {children}
            </div>
        </div>
    )
}
