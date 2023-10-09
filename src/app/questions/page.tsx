'use client'
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { polyfill } from 'interweave-ssr'; // interweave для того чтобы прочитать HTML из объекта
import { Markup } from 'interweave'; // interweave для того чтобы прочитать HTML из объекта
import { useAppSelector, useAppDispatch } from '../hooks'
import { nanoid } from 'nanoid'
import { useRouter } from "next/navigation";
import Link from "next/link"
import { useSession } from "next-auth/react"

// import { Configuration, OpenAIApi } from "openai";

import { DataReport, IQuestion, IAnswer, ICategory } from "../components/Types";
import Search from '../components/Search';
import PageForm__leftSide from '../components/PageForm__leftSide';
import { getDbAllAnswers, getDbAllQuestions, getDbAnswers } from "@/services/DatabaseService";
import { getAnswers, getQuestions } from "../store/DataSlice";

export default function MyQuestions() {
  const [localData, setLocalData] = useState<ICategory[]>([]); // категории из localStorage
  const [nameQuestion, setNameQuestion] = useState('');   // nameQuestion - вопрос для передачи в отчет
  const [nameBlock, setNameBlock] = useState('');   // nameBlock - название раздела вопросов для передачи в отчет
  const [dataReport, setDataReport] = useState<DataReport | null>(null); // отправляем и в гугл таблицу и на страницу reports
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentIdQuestion, setCurrentIdQuestion] = useState(''); // определяем активные(раскрытые) вопросы по id
  const [currentMark, setCurrentMark] = useState<string | number>(''); // оценка для каждого вопроса
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
    copy[dataToGoogleSheets.length + 1] = [`Представь, что ты - фронтенд разаботчик с опытом в 10 лет и тебе нужно написать обратную связь собеседовываемому на профессию ${storeProfession?.title}. Здесь тебе предоставлены данные собеседования: вопросы, оценки ответов к этим вопросам по пятибальной системе и комментарии (если есть). Cредння оценка за все собеседование - ${averageMark}. Пожалуйста, проанализируй данные и дай общий вывод о знаниях кандидата (укажи в выводе профессию, по которой прошло собеседование) и стоит ли его брать на работу.`];
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
    // const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    // const OPENAI_API_KEY = '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';
    const headers = {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Authorization': `Bearer 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`,
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

  useEffect(() => { // сохраняем поставленную оценку для каждого вопроса при возвращении к нему
    for (let [key, value] of Object.entries(dataReport || {})) {
      if (key === nameBlock) {
        if (Array.isArray(value)) {
          let choosenQuestion = value.find(item => {
            if (item[0] === nameQuestion) return item
          })
          if (choosenQuestion && choosenQuestion[1]) {
            setCurrentMark(choosenQuestion[1])
          } else {
            setCurrentMark('0')
          }
        }
      }
    }
  }, [dataReport, currentIdQuestion])

  return (
    <div className='container container__form'>
      <div className='questions__leftSide'>
        <Search />
        <PageForm__leftSide getQuestionText={getQuestionText} getCategoryTitle={getCategoryTitle} pageName="questions" />
        <div className='questions__nextPage-wrapper left'>
          <button disabled={!currentMark} className='questions__nextPage-btn' onClick={() => setIsOpenModal(!isOpenModal)}>Отчет</button>
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

              <div className="answers__marks">
                <span className="answers__title">Оцените ответ</span>

                <div className="answers__wrapper-mark" >
                  <input type="radio" className="answers__mark mark1" id="mark1" name="mark" value="1" checked={currentMark === "1"}
                    onChange={handleChange} />
                  <label htmlFor="mark1" className={`answers__label ${currentMark === '1' ? 'mark1' : ''}`}>1</label>
                  <img src="/sad.svg" alt="" className="answers__img" />
                </div>

                <div className="answers__wrapper-mark" >
                  <input type="radio" className="answers__mark mark2" id="mark2" name="mark" value="2" checked={currentMark === "2"}
                    onChange={handleChange} />
                  <label htmlFor="mark2" className={`answers__label ${currentMark === '2' ? 'mark2' : ''}`}>2</label>
                  <img src="/sleepy.svg" alt="" className="answers__img" />
                </div>

                <div className="answers__wrapper-mark" >
                  <input type="radio" className="answers__mark mark3" id="mark3" name="mark" value="3" checked={currentMark === "3"}
                    onChange={handleChange} />
                  <label htmlFor="mark3" className={`answers__label ${currentMark === '3' ? 'mark3' : ''}`}>3</label>
                  <img src="/confused.svg" alt="" className="answers__img" />
                </div>

                <div className="answers__wrapper-mark" >
                  <input type="radio" className="answers__mark mark4" id="mark4" name="mark" value="4" checked={currentMark === "4"}
                    onChange={handleChange} />
                  <label htmlFor="mark4" className={`answers__label ${currentMark === '4' ? 'mark4' : ''}`}>4</label>
                  <img src="/smile.svg" alt="" className="answers__img" />
                </div>

                <div className="answers__wrapper-mark" >
                  <input type="radio" className='answers__mark mark5' id="mark5" name="mark" value="5" checked={currentMark === "5"}
                    onChange={handleChange} />
                  <label htmlFor="mark5" className={`answers__label ${currentMark === '5' ? 'mark5' : ''}`}>5</label>
                  <img src="/cool.svg" alt="" className="answers__img" />
                </div>
              </div>

              <label className="answers__textarea">
                <div className="answers__textarea-wrapper">
                  <p className="answers__textarea-title">Добавьте комментарий</p>
                </div>
                <textarea
                  name="comment"
                  className="answers__textarea-body"
                  placeholder="Комментарий"
                  value={form.comment}
                  onChange={handleChange}
                />
              </label>

              {isOpenModal && <div className="modalWindow">
                <div className="modalWindow__container">
                  {<div className="search__clear modalWindow__close" onClick={() => setIsOpenModal(!isOpenModal)}></div>}
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Введите имя претендента" className="answers__textarea-body" required />
                  {/* <input type="text" name="conclusion" value={form.conclusion} onChange={handleChange} placeholder="Введите общий вывод" className="answers__textarea-body" /> */}
                  <button className='questions__nextPage-btn' type="submit"> Перейти к отчету</button>
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
            <Link className='questions__noData-btn' href='/'><p>Начнем</p></Link>
          </div>
        </div>
      }
    </div>
  )
}
