'use client'
import { signIn } from "next-auth/react"
import { useSearchParams } from 'next/navigation'

const LinkedinButton = () => {
  // получаем данные из URL используя useSearchParams()
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  return (
    // signIn встроенная функция, она принимает провайдер из встроенного списка
    // мы можем указать как именно логиниться через созданную переменную (callbackUrl),
    // которую мы можем получать через адресную строку используя useSearchParams()
    <button onClick={() => signIn('linkedin', { callbackUrl })}>
      Sign in with LinkedIn
    </button>
  )
}
export { LinkedinButton }
