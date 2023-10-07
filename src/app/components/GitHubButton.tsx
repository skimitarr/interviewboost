'use client'
import { signIn } from "next-auth/react"
import { useSearchParams } from 'next/navigation'

const GitHubButton = () => {
  // получаем данные из URL используя useSearchParams()
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/questions';

  return (
    // signIn встроенная функция, она принимает провайдер из встроенного списка
    // мы можем указать как именно логиниться через созданную переменную (callbackUrl),
    // которую мы можем получать через адресную строку используя useSearchParams()
    <button onClick={() => signIn('github', { callbackUrl })} className="signIn__btn">
      <div className="signIn__text">
        <img src="/icon-github.svg" alt="logo github" className="signIn__img" />
        <p className="signIn__desc">Sign in with GitHub</p>
      </div>
    </button>
  )
}
export { GitHubButton }
