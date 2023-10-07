// это серверный компонент. Для получения данных сессии на серверных компонентах
// используем getServerSession(), на клиентских хук useSession

import { authConfig } from '@/configs/auth'
import { getServerSession } from 'next-auth/next'

export default async function Profile() {
  // getServerSession это хелпер, который работает только на серверных компонентов
  // в него передали конфиг, получил сессию, оттуда достаем данные
  const session = await getServerSession(authConfig)
  // console.log(session)

  return (
    <div>
      <h1>Profile of {session?.user?.name}</h1>
      {session?.user?.image && <img src={session.user.image} alt='' />}
    </div>
  )
}

