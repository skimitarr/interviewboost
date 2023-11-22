'use client'
import { signIn } from "next-auth/react"
import { useSearchParams } from 'next/navigation'
import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { colorBlack2, colorWhite } from "@/css/variables";

export const GoogleButton = () => {
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
      onClick={() => signIn('google', { callbackUrl })}
      startIcon={<Avatar alt="logo google" src="/icon-google.svg" sx={{ width: '24px', height: '24px', }} />}
      sx={{
        width: '400px',
        height: '30px',
        borderRadius: '5px',
        marginBottom: '10px',
        border: `1px solid ${colorWhite}`,
        background: colorBlack2,
      }}
    >
      <Typography>{t('signInWithGoogle')}</Typography>
    </Button>
  )
}
