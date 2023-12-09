'use client'
import { signIn } from "next-auth/react"
import { useSearchParams } from 'next/navigation'
import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export const GitHubButton = () => {
  // получаем данные из URL используя useSearchParams()
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/interview';
  const { t } = useTranslation();

  return (
    // signIn встроенная функция, она принимает провайдер из встроенного списка
    // мы можем указать как именно логиниться через созданную переменную (callbackUrl),
    // которую мы можем получать через адресную строку используя useSearchParams()
    <Button
      variant="outlined"
      onClick={() => signIn('github', { callbackUrl })}
      startIcon={<Avatar alt="GitHub Logo" src="/icon-github.svg" sx={{ width: '24px', height: '24px', }} />}
      sx={({ custom }) => ({
        width: '400px',
        height: '30px',
        borderRadius: '5px',
        marginBottom: '10px',
        border: `1px solid ${custom.colorSnowWhite}`,
        background: custom.colorGraphiteGray,
      })}
    >
      <Typography>{t('signInWithGitHub')}</Typography>
    </Button>
  )
}
