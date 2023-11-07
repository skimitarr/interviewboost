'use client'
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from "react"
import { useTranslation } from 'react-i18next'
import classnames from "classnames"

export function Navigation({ navLinks }: {
  navLinks: [{
    label: string
    href: string
  }]
}) {
  const [wantSignOut, setWantSignOut] = useState(false);
  const { t } = useTranslation();
  const pathname = usePathname()
  const session = useSession();
  const signoutLinkRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (signoutLinkRef.current && !signoutLinkRef.current.contains(event.target as Node)) {
        setWantSignOut(false);
      }
    }

    if (wantSignOut) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [wantSignOut]);

  return (
    <header className="header">
      <div className="header__wrapper-1">
        {navLinks.map(link => {
          return <Link key={link.label} href={link.href}
            className={classnames(
              'header__link',
              { 'active': pathname === link.href }
            )}>
            <p className="header__link-text">{t(link.label)}</p>
          </Link>
        })}
      </div>
      <div className="header__wrapper-2">
        {session?.data
          ? <>
            <p className="header__email">{session.data.user?.email}</p>
            <img onClick={() => setWantSignOut(!wantSignOut)} src="../../../signIn.svg" alt="profile's logo" />
            {wantSignOut && <Link className="header__link header__link-signout btn" ref={signoutLinkRef} href='#' onClick={() => signOut({ callbackUrl: '/' })}>{t('logOut')}</Link>}
          </>
          : <Link className="header__link header__link-signin" href='/signin'>
            <p className="header__link-text btn">{t('signIn')}</p>
          </Link>
        }
      </div>
    </header>
  )
}
