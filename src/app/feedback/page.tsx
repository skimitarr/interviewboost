'use client'
import { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Feedback() {
  const [message, setMessage] = useState('');
  const { t } = useTranslation();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => { // Устанавливаем фокус на элемент inputRef после загрузки компонента
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
    <div className='feedback'>
      <form className='feedback__form' onSubmit={handleSubmit}>
        <h1 className='feedback__title'>{t('sendFeedback')}</h1>
        <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} ref={inputRef} className="feedback__textarea" ></textarea>
        <button className='feedback__btn btn' type="submit">{t('send')}</button>
      </form>
    </div>
  )
}
