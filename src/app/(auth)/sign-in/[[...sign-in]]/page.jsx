import { SignIn } from '@clerk/nextjs'

export const metadata = {
  title: "Entrar",
  description: "Acesse sua conta para continuar aprendendo na EduGen.",
};

export default function Page() {
  return (
    <SignIn
      fallbackRedirectUrl="/workspace"
      signUpFallbackRedirectUrl="/workspace"
    />
  )
}
