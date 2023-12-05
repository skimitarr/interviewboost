'use client'
import {
  FormEvent,
  useEffect,
  useRef,
  useState
} from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { StyledForm, StyledTextarea } from "./style";
import { MixinFlexCenter, MixinBtn } from '@/css/variables';

export default function Feedback() {
  const [message, setMessage] = useState('');
  const { t } = useTranslation();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => { // Устанавливаем фокус на элемент inputRef после загрузки компонента
    inputRef.current && inputRef.current.focus();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.NEXT_PUBLIC_CHAT_ID

    const API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message
        }),
      });

      if (response.ok) {
        alert('Сообщение успешно отправлено');
        setMessage('');
      } else {
        alert('Ошибка при отправке сообщения');
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка при отправке сообщения');
    }
  };

  return (
    <Box
      sx={({ custom }) => ({
        ...MixinFlexCenter,
        height: 'calc(100vh - 80px)',
        backgroundColor: custom.colorMidnightCoal,
      })}>
      <StyledForm onSubmit={handleSubmit}>
        <Typography variant="h1" sx={{ marginBottom: '50px', fontSize: '36px' }}>{t('sendFeedback')}</Typography>
        <StyledTextarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={inputRef}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ ...MixinBtn }}
        >
          {t('send')}
        </Button>
      </StyledForm>
    </Box>
  )
}
