'use client'
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useState } from "react"
import { useTranslation } from 'react-i18next'
import { Props } from "./Types"

const Navigation = ({ navLinks }: Props) => {
  const [wantSignOut, setWantSignOut] = useState(false);
  const { t } = useTranslation();
  const pathname = usePathname()
  const session = useSession();

  return (
    <header className="header">
      <div className="header__wrapper-1">
        {
          navLinks.map(link => {
            const isActive = pathname === link.href
            return <Link key={link.label} href={link.href} className={isActive ? 'header__link active' : 'header__link'} >
              <p className="header__link-text">{t(link.label)}</p>
            </Link>
          })}
      </div>
      <div className="header__wrapper-2">
        {session?.data
          ? <>
            <p className="header__email">{session.data.user?.email}</p>
            <img onClick={() => setWantSignOut(!wantSignOut)} src="../../../signIn.svg" alt="profile's logo" />
            {wantSignOut && <Link className="header__link header__link-signout btn" href='#' onClick={() => signOut({ callbackUrl: '/' })}>{t('logOut')}</Link>}
          </>
          : <Link className="header__link header__link-signin" href='/signin'>
            <p className="header__link-text btn">{t('signIn')}</p>
          </Link>
        }
      </div>
    </header>
  )
}
export { Navigation }
