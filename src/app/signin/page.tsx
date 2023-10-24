'use client'
import { useTranslation } from "react-i18next";
import { GitHubButton } from "../components/GitHubButton";
import { GoogleButton } from "../components/GoogleButton";

export default async function Signin() {
  const { t } = useTranslation();

  return (
    <div className="signIn">
      <div className="signIn__container">
        <h1 className="signIn__title">{t('logInYourAccount')}</h1>
        <GoogleButton />
        <GitHubButton />
      </div>
    </div>
  )
}
