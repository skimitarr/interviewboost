// создаем динамические роуты это позволит библиотеке создавать
// любое количество роутов
// создание папки api/auth/[...nextauth]/этот файл дает нам то, что
// в приложении автоматически создалась страница localhost:3000/api/auth/signin
// и в нем будет то что в конфиге (authConfig)
import NextAuth from 'next-auth'
import { authConfig } from '@/configs/auth'

const handler = NextAuth(authConfig);

// нужно вернуть методы - то что нужно самой библиотеке
export { handler as GET, handler as POST }

// в том чтобы убедиться что я авторизован есть разный набор хелперов
// в зависимости от клиентских и серверных компонентов
