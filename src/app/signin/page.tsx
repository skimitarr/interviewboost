'use client'
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { GitHubButton } from "../components/GitHubButton";
import { GoogleButton } from "../components/GoogleButton";
import { MixinFlexCenter, colorBlack1 } from "@/css/variables";

export default async function Signin() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        ...MixinFlexCenter,
        height: 'calc(100vh - 80px)',
        backgroundColor: colorBlack1,
      }}>
      <Box sx={{ ...MixinFlexCenter, flexDirection: 'column' }}>
        <Typography variant="h1" sx={{ marginBottom: '50px', fontSize: '48px' }}>
          {t('logInYourAccount')}
        </Typography>
        <GoogleButton />
        <GitHubButton />
      </Box>
    </Box>
  )
}
