import { SignUp } from '@clerk/nextjs'

export const metadata = {
  title: "Criar conta",
  description: "Crie sua conta gratuita e comece a aprender com cursos gerados por IA.",
};

export default function Page() {
    return (
        <SignUp
            fallbackRedirectUrl="/workspace"
            signInFallbackRedirectUrl="/workspace"
        />
    )
}
