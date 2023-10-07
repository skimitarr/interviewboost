import { useSession } from "next-auth/react"
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function Feedback({ nameQuestion }: { nameQuestion: string }) {
  const [form, setForm] = useState({
    name: '',
    question: '',
    mark: '',
    comment: '',
  });
  const session = useSession();

  useEffect(() => {
    setForm({
      ...form,
      question: nameQuestion,
    });
  }, [nameQuestion])

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
    const content = await response.json()
    console.log(content);

    setForm({
      name: '',
      question: nameQuestion,
      mark: '',
      comment: '',
    })
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getAnswer = () => {

  }

  return (
    session?.data && (
      <div className="main__block main__feedback">
        <form className="space-y-3 max-w-lg mx-auto p-5" onSubmit={submitForm}>
          <h3>Feedback</h3>
          <label className="block">
            <span className="text-gray-700 font-semibold">ФИО прендента</span>
            <input
              name="name"
              type="text"
              className="form-input form-field-contact"
              placeholder="Введите ФИО"
              value={form.name}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-semibold">Введите оценку ответа на вопрос от 0 до 10</span>
            <input
              name="mark"
              type="number"
              className="form-input form-field-contact"
              placeholder="Введите оценку"
              value={form.mark}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-semibold">Можете к оценке добавить комментарий</span>
            <textarea
              name="comment"
              className="form-textarea form-field-contact"
              rows={3}
              placeholder="Комментарий"
              value={form.comment}
              onChange={handleChange}
            />
          </label>

          <p>Нажав на кнопку "Добавить", вы добавите оценку вопроса в фидбек</p>
          <button
            className="bg-green-200 px-3 py-1 font-semibold shadow-md rounded-md"
            type="submit"
          >
            Добавить
          </button>
        </form>

        <p>Нажав на кнопку "Закончить собседование", вы получите на свою почту фидбек</p>
        <button onClick={() => getAnswer()}>Закончить собседование</button>
      </div>
    )
  )
}
// feedbackappforarthur
// 12345678qwertyui
