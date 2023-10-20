'use client'
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { polyfill } from 'interweave-ssr'; // interweave для того чтобы прочитать HTML из объекта
import { Markup } from 'interweave'; // interweave для того чтобы прочитать HTML из объекта
import { useAppSelector, useAppDispatch } from '../hooks'
import { nanoid } from 'nanoid'
import { useRouter } from "next/navigation";
import Link from "next/link"
import { useSession } from "next-auth/react"

import { DataReport, IQuestion, IAnswer, ICategory } from "../components/Types";
import Search from '../components/Search';
import PageForm__leftSide from '../components/PageForm__leftSide';
import { addReport, getDbAllAnswers, getDbAllQuestions } from "@/services/DatabaseService";
import { getAnswers, getQuestions } from "../store/DataSlice";

const arrMarks = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95', '100',]

export default function MyQuestions() {
  const [localData, setLocalData] = useState<ICategory[]>([]); // категории из localStorage
  const [nameQuestion, setNameQuestion] = useState('');   // nameQuestion - вопрос для передачи в отчет
  const [nameBlock, setNameBlock] = useState('');   // nameBlock - название раздела вопросов для передачи в отчет
  const [dataReport, setDataReport] = useState<DataReport | null>(null); // отправляем и в гугл таблицу и на страницу reports
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentIdQuestion, setCurrentIdQuestion] = useState(''); // определяем активные(раскрытые) вопросы по id
  const [currentMark, setCurrentMark] = useState<string | number>('-1'); // оценка для каждого вопроса
  const [currentComment, setCurrentComment] = useState<string>(''); // коментарий для каждого вопроса
  const [filteredAnswers, setFilteredAnswers] = useState<IAnswer[]>([]);
  const [loading, setLoading] = useState(false); // показывает лоадер когда чатГПТ делает вывод
  const [form, setForm] = useState({
    name: '',
    question: '',
    mark: '',
    comment: '',
  });

  const session = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch()
  const storeProfession = useAppSelector((state) => state.profession)
  const storeQuestions = useAppSelector((state) => state.questions)
  const storeAnswers = useAppSelector((state) => state.answers)
  const storeCurrentIdQuestion = useAppSelector((state) => state.currentIdQuestion)

  const isBrowser = typeof window !== 'undefined'; // Проверяем, что код выполняется в браузерной среде
  const local = isBrowser ? localStorage.getItem('choosenCategories') ?? '' : '';

  const fetchQuestions = async () => {
    try {
      let questionsData = await getDbAllQuestions();
      questionsData = questionsData.sort((a: any, b: any) => a.id - b.id)
      dispatch(getQuestions(questionsData));
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

  const fetchAnswers = async () => {
    try {
      const answersData = await getDbAllAnswers();
      dispatch(getAnswers(answersData));
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

  useEffect(() => { //если не зареган, переходим на окно регистрации
    if (session.status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [session]);

  useEffect(() => { // получаем выбранные категории из localstorage
    setLocalData(JSON.parse(local))
  }, [local])

  useEffect(() => {
    if (localData && storeQuestions.length <= 0) {
      fetchQuestions();
      fetchAnswers();
    }
  }, [localData])

  useEffect(() => { // nameBlock для первого вопроса
    if (localData.length > 0)
      setNameBlock(localData[0]?.title)
  }, [localData])

  useEffect(() => { // nameQuestion для первого вопроса
    if (localData.length > 0) {
      const initialIdQuestion = localData.length > 0 ? localData[0].questions[0] : '';
      let firstQuestion = storeQuestions.find(item => item.id === initialIdQuestion)
      if (firstQuestion)
        setNameQuestion(firstQuestion.text)
    }
  }, [storeQuestions, localData])

  useEffect(() => { // сохраняем в filteredAnswers только те ответы,id которых есть в вопросах
    if (storeQuestions.length > 0) {
      let set = new Set();
      storeQuestions.forEach((question: IQuestion) => {
        question.answers.forEach(item => { set.add(item) })
      });
      const arrayOfIds = Array.from(set); // получаем все id ответов со всех тем

      if (storeAnswers.length > 0) { // если в сторе есть ответы берем их оттуда
        const answersData = storeAnswers.filter((item) => {
          return arrayOfIds.includes(item.id);
        })
        setFilteredAnswers(answersData);
      }
    }
  }, [storeQuestions, storeAnswers])

  useEffect(() => { //при изменении storeCurrentIdQuestion открываем новый вопрос
    setCurrentIdQuestion(storeCurrentIdQuestion);
    setForm({ // очищаем форму для следующего вопроса
      name: '',
      question: nameQuestion,
      mark: '',
      comment: '',
    });
    setCurrentMark('');
  }, [storeCurrentIdQuestion])

  polyfill(); // для чтения HTML из объекта для SSR

  function calculateAverageMark() { // Найти все строки "Итого" и вычислить среднее значение
    const totalRows: (string | number | undefined)[][] = [];
    for (const blockName in dataReport) {
      if (dataReport.hasOwnProperty(blockName)) {
        const block = dataReport[blockName];
        for (let i = 0; i < block.length; i++) {// Найти строки "Итого" в блоке и добавить их данные в totalRows
          const rowData = block[i];
          if (rowData[0] === 'Итого') {
            totalRows.push(rowData);
          }
        }
      }
    }
    // Вычислить среднее значение на основе данных строк "Итого"
    let totalMark = 0;
    let totalQuestions = 0;

    for (let i = 0; i < totalRows.length; i++) {
      const rowData = totalRows[i];

      // Получить оценку из данных строки "Итого"
      const mark = parseFloat(String(rowData[1]).replace(',', '.'));

      if (!isNaN(mark)) {
        totalMark += mark;
        totalQuestions++;
      }
    }

    if (totalQuestions > 0) {
      const averageMark = (totalMark / totalQuestions).toFixed(2);
      return averageMark;
    } else {
      return '';
    }
  }

  const submitForm = async (e: FormEvent<HTMLFormElement>) => { // отправляем данные в гугл таблицу (и не только)
    e.preventDefault();
    const dataToGoogleSheets: any = []; // отправляем данные в гугл таблицу
    const averageMark = calculateAverageMark();
    for (const blockName in dataReport) {
      if (dataReport.hasOwnProperty(blockName)) {
        const block = dataReport[blockName];
        console.log(blockName)
        console.log(block)
        dataToGoogleSheets.push([`Раздел ${blockName}`]); // Добавляем заголовки блока
        dataToGoogleSheets.push(['Вопрос', 'Оценка', 'Комментарий']); // Добавляем заголовки вопросов
        dataToGoogleSheets.push(...block); // Добавляем данные вопросов
        dataToGoogleSheets.push([]); // Пустая строка между блоками
      }
    }
    // добавляем в начало и конец имя и общий вывод
    dataToGoogleSheets.unshift([]);
    dataToGoogleSheets.unshift([`Имя претендента: ${form.name}`]);
    dataToGoogleSheets.push([`Общий вывод`]);
    dataToGoogleSheets.push([`Комментарий`, 'Оценка']);

    const copy = dataToGoogleSheets // чатГпт делает вывод
    copy[dataToGoogleSheets.length + 1] = [`Вы - опытный frontend-разработчик и технический лидер с многолетним опытом работы на коммерческих проектах.
    В настоящее время вы проводите собеседование с кандидатом на должность ${storeProfession?.title}.
    Вам представлены конкретные данные об ответах кандидата на заданные вопросы:
    Список вопросов, охватывающих профессиональные навыки и знания
    Оценка по 100-балльной шкале за каждый ответ, границы оценок по 100-балльной шкале:

    90-100: Отлично
    80-85: Хорошо
    70-75: Удовлетворительно
    60-65: Ниже среднего
    50-55: Неудовлетворительно
    40-45: плохо 30-35: очень плохо
     20-25: крайне плохо
     10-15: недопустимо плохо
     0-5: абсолютно неудовлетворительно
    Комментарии к каждому ответу (если есть)
    Средняя оценка кандидата по каждой категории есть в предоставленном тебе отчете
    Общая средняя оценка кандидата по всем ответам - ${averageMark}.
    В своей оценке вы полагаетесь исключительно на предоставленные фактические оценки и комментарии.
    Если в отчет нет комментариев стоят только оценки, формируй отчет на основании оценок.
    Если в отчете есть комментарии по ответам на вопросы, в таком случае вы можете описать более детализированный отчет
    Вы не используете предположительные слова вроде "возможно", "вероятно", "скорее всего", "наверное".
    Если общая средняя оценка кандидата после собеседования ниже 60 баллов, вы не рекомендуете его принимать на работу. Если средняя оценка кандидата в любой категории ниже 60 баллов, вы не рекомендуете его принимать на работу. В остальных случаях вы подробно описываете сильные и слабые стороны кандидата исходя только из оценок и комментариев к вопросам если они есть, чтобы помочь принять взвешенное решение о приеме на работу.
    Ваша цель - проанализировать данные и дать развернутый, обоснованный вывод об  уровне знаний кандидата, а также рекомендации к приему на работу(рекомендовал или не рекомендовал)`];
    const questionsAndAnswers = Object.keys(copy).map((key) => {
      const data = copy[key];
      return {
        role: 'user',
        content: data.join('\n'), // Преобразуйте данные в строку и добавьте их как content
      };
    });
    let conclusion = '';
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: questionsAndAnswers,
      temperature: 0.7,
    };
    const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    };
    setLoading(!loading);
    await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        conclusion = data.choices[0].message.content
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => setLoading(!loading));

    // const conclusion = await makeCoclusionByChatgpt(dataToGoogleSheets, averageMark)
    dataToGoogleSheets.push([`${conclusion}`, averageMark]);

    const response = await fetch('/api/submit', {// отправляем данные в гугл таблицу
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToGoogleSheets)
    })
    const content = await response.json()

    const newDataReport = { // Обновляем dataReport и сохраняем его в localStorage
      id: nanoid(),
      name: form.name,
      ...dataReport,
      conclusion: [[`Общий вывод`], [conclusion, averageMark]]
    };
    localStorage.setItem('dataReport', JSON.stringify(newDataReport));

    function flattenArrays(obj: any) { // готовим данные для отправки отчета в Firestore
      if (Array.isArray(obj)) {
        return obj.flat(Infinity);
      } else if (typeof obj === 'object') {
        for (let key in obj) {
          obj[key] = flattenArrays(obj[key]);
        }
      }
      return obj;
    }
    const flattenedDataToGoogleSheets = flattenArrays(dataToGoogleSheets); // Применяем flat() к вашей структуре данных
    addReport(newDataReport.name, { data: flattenedDataToGoogleSheets }) // Отправляем данные в Firestore

    setIsOpenModal(!isOpenModal)

    router.push('/reports')
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
      question: nameQuestion,
    });
  };

  useEffect(() => { //поставив оценку, данные по вопросу сохраняем в dataReport
    if (form.mark) {
      // Обновите dataReport соответствующим образом на основе введенных данных
      setDataReport((prevData) => {
        // Создайте копию prevData
        const newData: DataReport = { ...prevData } as DataReport;

        // Вам нужно определить, к какому блоку добавлять данные
        const blockName = nameBlock;

        // Создайте массив данных для данного блока
        const blockData: (string | number | undefined)[] = [nameQuestion, form.mark, form.comment];

        // Добавьте данные к блоку (если блока нет, создайте его)
        if (!newData[blockName]) {
          newData[blockName] = [];
        }
        // Удаляем предыдущие данные, если это тот же вопрос
        newData[blockName] = newData[blockName].filter(item => item[0] !== blockData[0]);

        newData[blockName].push(blockData);

        // Вычисляем среднее значение для текущего блока
        const currentBlock = newData[blockName];
        let totalMark = 0;
        let totalQuestions = 0;

        for (let i = 0; i < currentBlock.length; i++) {
          const rowData = currentBlock[i];

          // Skip the 'Итого' row
          if (rowData[0] === 'Итого') {
            continue;
          }

          const mark = parseFloat(String(rowData[1]).replace(',', '.'));

          if (!isNaN(mark)) {
            totalMark += mark;
            totalQuestions++;
          }
        }

        if (totalQuestions > 0) {
          const averageMark = (totalMark / totalQuestions).toFixed(2);

          // Удаляем старую строку 'Итого' (если есть) и добавляем новую
          newData[blockName] = newData[blockName].filter(item => item[0] !== 'Итого');
          newData[blockName].push(['Итого', averageMark]);
        }

        return newData;
      });
    }
  }, [form.mark, form.comment]);

  const getQuestionText = (text: string) => { // получаем текст вопроса для отчета
    setNameQuestion(text)
  }

  const getCategoryTitle = (title: string) => { // получаем название категории для отчета
    setNameBlock(title)
  }

  useEffect(() => { // сохраняем поставленную оценку и коментарий для каждого вопроса при возвращении к нему
    for (let [key, value] of Object.entries(dataReport || {})) {
      if (key === nameBlock) {
        if (Array.isArray(value)) {
          let choosenQuestion = value.find(item => {
            if (item[0] === nameQuestion) return item
          })
          if (choosenQuestion) {
            setCurrentMark(choosenQuestion[1] as string)
            setCurrentComment(choosenQuestion[2] as string)
          } else {
            setCurrentMark('-1')
            setCurrentComment('')
          }
        }
      }
    }
  }, [dataReport, currentIdQuestion])

  return (
    <div className='container container__form'>
      <div className='questions__leftSide'>
        <Search />
        <PageForm__leftSide getQuestionText={getQuestionText} getCategoryTitle={getCategoryTitle} pageName="interview" />
        <div className='questions__nextPage-wrapper left'>
          <button disabled={!currentMark} className='questions__nextPage-btn btn' onClick={() => setIsOpenModal(!isOpenModal)}>Отчет</button>
        </div>
      </div>

      {storeProfession || localData
        ? <div className="answers">
          <div className='answers__container'>

            {currentIdQuestion
              ? filteredAnswers.filter((item: IAnswer) => {
                return item.id === currentIdQuestion; // фильтруем Answers, берем только те что есть в currentIdQuestion
              })
                .map((item: IAnswer) => {
                  return <Markup content={item.text} className="answers__content" key={item.id} />
                })
              : <p className="answers__preload">Выберете направление, а затем вопрос</p>}

            {currentIdQuestion && <form className="answers__form" onSubmit={submitForm}>

              <div className="answers__title">Оцените ответ от 0 до 100</div>
              <div className="answers__marks">
                {arrMarks.map(mark => {
                  return (
                    <div className="answers__wrapper-mark" key={mark}>
                      <input type="radio" className="answers__mark" id={`mark${mark}`} name="mark" value={mark} checked={currentMark === mark}
                        onChange={handleChange} />
                      <label htmlFor={`mark${mark}`} tabIndex={0}
                        className={
                          `answers__label ${+mark <= 55 ? 'mark_0-55' : ''}${+mark >= 60 && +mark <= 65 ? 'mark_60-65' : ''}${+mark >= 70 && +mark <= 75 ? 'mark_70-75' : ''}${+mark >= 80 && +mark <= 85 ? 'mark_80-85' : ''}${+mark >= 90 && +mark <= 100 ? 'mark_90-100' : ''}
                      `}
                      >{mark}</label>
                    </div>
                  )
                })}
              </div>

              <label className="answers__textarea">
                <div className="answers__textarea-wrapper">
                  <p className="answers__textarea-title">Добавьте комментарий</p>
                </div>
                <textarea
                  name="comment"
                  className="answers__textarea-body"
                  placeholder="Комментарий"
                  value={currentComment}
                  onChange={handleChange}
                />
              </label>

              {isOpenModal && <div className="modalWindow">
                <div className="modalWindow__container">
                  {<div className="search__clear modalWindow__close" onClick={() => setIsOpenModal(!isOpenModal)}></div>}
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Введите имя претендента" className="answers__textarea-body" required />
                  <button className='questions__nextPage-btn btn' type="submit"> Перейти к отчету</button>
                  {loading && <div className="modalWindow__loading">
                    <p className="modalWindow__loading-text">Пожалуйста подождите, генерирую отчет</p>
                    <div className="modalWindow__loading-loader"></div>
                  </div>}
                </div>
              </div>}
            </form>}

          </div>
        </div>
        :
        <div className='questions__rightSide'>
          <div className='questions__noData'>
            <p className='questions__noData-desc'>Для начала Вам необходимо выбрать специализацию</p>
            <Link className='questions__noData-btn btn' href='/'><p>Начнем</p></Link>
          </div>
        </div>
      }
    </div>
  )
}
