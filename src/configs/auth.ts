// создаем конфиги для авторизации
import { AuthOptions, User } from "next-auth";
// подключение юзера через гугл
import GoogleProvider from "next-auth/providers/google";
// import LinkedInProvider from "next-auth/providers/linkedin";
import GitHubProvider from "next-auth/providers/github";
// import GitlabProvider from "next-auth/providers/gitlab";

// обычное подключение юзера - регистрация
// import Credentials from 'next-auth/providers/credentials'
// import { users } from "@/data/users";

export const authConfig: AuthOptions = {
  providers: [
    // любой провайдер это функция с набором настроек
    GoogleProvider({
      // Для typescript (который думает что наши переменные undefined) указываем либо ! либо as string
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET!,
    }),
    // Credentials({
    //   // credentials - это то что мы будем спрашивать у пользователя
    //   credentials: {
    //     email: {label: 'email', type: 'email', required: true},
    //     password: {label: 'password', type: 'password', required: true},
    //   },
    //   // функция authorize получает credentials, проверяет авторизованы мы или нет и возвращает значение
    //   // в данном случае либо null, либо юзера
    //   async authorize(credentials) {
    //     if (!credentials?.email || !credentials.password) return null;

    //     const currentUser = users.find(user => user.email === credentials.email)
    //     if (currentUser && currentUser.password === credentials.password) {
    //       // изымаем пароль, чтобы он не пришел на фронтенд
    //       const {password, ... userWithoutPass} = currentUser;
    //       // authorize ожидает что мы вернем определенный тип данных, поэтому добавляем as User
    //       return userWithoutPass as User
    //     }

    //     return null
    //   }
    // }),
    // LinkedInProvider({
    //   // ютуб как делать https://www.youtube.com/watch?v=YJoof1kX_kQ
    //   clientId: process.env.LINKEDIN_CLIENT_ID!,
    //   clientSecret: process.env.LINKEDIN_CLIENT_SECRET!
    // }),
      GitHubProvider({
        // ютуб как делать https://www.youtube.com/watch?v=n1cz93cBQSA
        clientId: process.env.NEXT_PUBLIC_GITHUB_ID!,
        clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET!
      }),
      // GitlabProvider({
      //   clientId: process.env.GITLAB_CLIENT_ID!,
      //   clientSecret: process.env.GITLAB_CLIENT_SECRET!
      // }),
  ],

  // насколько я понял в нексте есть предустановленные страницы (например signIn и signOut)
  // мы здесь указываем - заменить предустановленные страницы на наши и тогда надо изменить
  // ссылку на новую страницу вместо дефолтной
  pages: {
    signIn: '/signin',
  }
}
// http://localhost:3000/api/auth/callback/google
