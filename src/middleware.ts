// сейчас мы тут делаем страницу профиль приватной
// переэкспортируем готоый мидлвеар
export { default } from 'next-auth/middleware'

// matcher -это набор роутов, которые мы хотим чтобы были приватными
// например, статика matcher: ['/profile']
// например, динамический набор параметров  matcher: ['/protected/:path*']
// только роуты указанные в matcher будут выполнять мидлвеар default
export const config = {matcher: ['/profile']}
