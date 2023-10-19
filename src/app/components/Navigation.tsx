'use client'

// есть встроенные функции signIn и signOut. signIn не используем, потому что мы создали страницу для нее
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react"

type NavLink = {
  label: string
  href: string
}
type Props = {
  navLinks: NavLink[]
}

const Navigation = ({ navLinks }: Props) => {
  const [wantSignOut, setWantSignOut] = useState(false)

  const pathname = usePathname()
  // добавление переменную чтобы знать авторизованы или нет и на основе этой информации будем показывать или нет пункты меню
  // useSession использует реакт.контекст, чотбы заработал его нужно обернуть в SessionProvider. Это сделано в файле Providers.tsx
  // есть другой вариант вместо useSession - через сервер получать сессию и передавать сюда
  const session = useSession();

  //парящий хедер
  // const [isScrolled, setIsScrolled] = useState(false);
  // const scrollContainer = document.querySelector('.report');
  // const header = document.querySelector('.header');
  // const container = document.querySelector('.container');
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (scrollContainer) {
  //       scrollContainer.scrollTop > 10 ? setIsScrolled(true) : setIsScrolled(false);
  //     }
  //   };
  //   if (scrollContainer) {
  //     scrollContainer.addEventListener('scroll', handleScroll);
  //   }
  //   return () => {
  //     if (scrollContainer) {
  //       scrollContainer.removeEventListener('scroll', handleScroll);
  //     }
  //   };
  // }, []);
  // useEffect(() => {
  //   if (header) {
  //     if (isScrolled) {
  //       header.classList.add('scrolled');
  //       container?.classList.add('scrolled');
  //       scrollContainer?.classList.add('scrolled');
  //     } else {
  //       header.classList.remove('scrolled');
  //       container?.classList.remove('scrolled');
  //       scrollContainer?.classList.remove('scrolled');
  //     }
  //   }
  // }, [isScrolled]);

  return (
    <header className="header">
      <div className="header__wrapper-1">
        {
          navLinks.map(link => {
            const isActive = pathname === link.href
            return <Link key={link.label} href={link.href} className={isActive ? 'header__link active' : 'header__link'} >
              <p className="header__link-text">{link.label}</p>
            </Link>
          })}
      </div>
      {/* {session?.data && (
        <Link className="header__link" href='/profile'>Profile</Link>
      )} */}
      <div className="header__wrapper-2">
        {session?.data
          // callbackUrl специальное свойство которое перенаправляет нас на страницу
          ? <>
            <p className="header__email">{session.data.user?.email}</p>
            <img onClick={() => setWantSignOut(!wantSignOut)} src="../../../signIn.svg" alt="profile's logo" />
            {wantSignOut && <Link className="header__link header__link-signout btn" href='#' onClick={() => signOut({ callbackUrl: '/' })}>Log&nbsp;out</Link>}
          </>
          : <Link className="header__link header__link-signin" href='/signin'>
            <p className="header__link-text btn">Sign In</p>
          </Link>
          // : <Link href='/api/auth/signin'>Sign In</Link>
        }
      </div>
    </header>
  )
}
export { Navigation }
