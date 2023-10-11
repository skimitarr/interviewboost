'use client'
import { FormEvent, useEffect, useRef, useState } from "react"

export default function Feedback() {
  const [message, setMessage] = useState('');

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

    // try { // отправка на почту На localhost не работает
    //   // const response = await fetch('/api/sendFeedback', {
    //   const response = await fetch('/api/send', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ message }),
    //   });

    //   if (response.ok) {
    //     alert('Сообщение успешно отправлено');
    //     setMessage('');
    //   } else {
    //     alert('Ошибка при отправке сообщения');
    //   }
    // } catch (error) {
    //   console.error(error);
    //   alert('Ошибка при отправке сообщения');
    // }
  };

  return (
    <div className='feedback'>
      <form className='feedback__form' onSubmit={handleSubmit}>
        <h1 className='feedback__title'>Send feedback or Report an error</h1>
        <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} ref={inputRef} className="feedback__textarea" ></textarea>
        <button className='feedback__btn btn' type="submit"> Отправить</button>
      </form>
    </div>
  )
}
