'use client'
import { useSession, signOut } from "next-auth/react"
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from "react"
import { useTranslation } from 'react-i18next'
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Avatar from "@mui/material/Avatar"
import { StyledHeader, StyledLinkNavigation, StyledLinkSignIn, StyledLinkSignOut } from "./style"

export function Navigation({ navLinks }: {
  navLinks: {
    label: string
    href: string
  }[]
}) {
  const [wantSignOut, setWantSignOut] = useState(false);
  const { t } = useTranslation();
  const pathname = usePathname()
  const session = useSession();
  const signoutLinkRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => { // закрывать кнопку signOut, если кликнуть вне ее
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
    <StyledHeader>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: 'calc(100vw / 3)',
          marginRight: '50px',
        }}
      >
        {navLinks.map(link => (
          <StyledLinkNavigation
            key={link.label}
            href={link.href}
            $isPathname={pathname === link.href}
          >
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              {t(link.label)}
            </Typography>
          </StyledLinkNavigation>
        ))}
      </Box>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          marginRight: '20px',
        }}>
        {session?.data
          ? <>
            <Typography sx={{ marginRight: '23px' }}>
              {session.data.user?.email}
            </Typography>
            <Button
              onClick={() => setWantSignOut(!wantSignOut)}
              sx={{
                minWidth: '40px',
                padding: '0',
                '& .MuiButton-startIcon': {
                  margin: '0'
                },
              }}
              startIcon={<Avatar
                alt="profile's logo"
                src="../../../signIn.svg"
                sx={{ width: '40px', height: '40px' }}
              />}
            >
            </Button>
            {wantSignOut &&
              <StyledLinkSignOut
                ref={signoutLinkRef}
                href='#'
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                {t('logOut')}
              </StyledLinkSignOut>}
          </>
          : <StyledLinkSignIn href='/signin'>{t('signIn')}</StyledLinkSignIn>
        }
      </Box>
    </StyledHeader>
  )
}
