'use client'
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { polyfill } from 'interweave-ssr'; // interweave для того чтобы прочитать HTML из объекта
import { Markup } from 'interweave'; // interweave для того чтобы прочитать HTML из объекта
import { useAppDispatch } from '../hooks';
import { nanoid } from 'nanoid';
import { useTranslation } from "react-i18next";
import applySpec from 'ramda/es/applySpec';
import fastDeepEqual from 'fast-deep-equal';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Search } from '../components/Search/Search';
import { StyledLink, StyledRightSide } from "../components/PageFormRightSide/style";
import { PageFormLeftSide } from '../components/PageFormLeftSide/PageFormLeftSide';
import { addReport } from "@/services/DatabaseService";
import { selectFromAppData } from '@/app/store/selectors/data';
import { StoreState } from "@/app/store/types";
import { MixinBtn, MixinFlexCenter, MixinGridContainer } from "@/css/variables";
import {
  StyledBtnWrapper,
  StyledForm,
  StyledLeftContainer,
  StyledModalWindow,
  StyledModalWindowClear,
  StyledModalWindowContainer,
  StyledModalWindowInput,
  StyledModalWindowLoader,
  StyledModalWindowLoading,
  StyledRadioLabel,
  StyledRightContainer,
  StyledTextarea,
  StyledTextareaLabel
} from "./style";
import {
  DataReport,
  IQuestion,
  IAnswer,
  ICategory,
  IProffesion
} from "../components/Types";

const arrMarks = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55',
  '60', '65', '70', '75', '80', '85', '90', '95', '100',]

type Selector = {
  storeProfession: IProffesion | null,
  storeQuestions: IQuestion[],
  storeAnswers: IAnswer[],
  storeCurrentIdQuestion: string,
};

const selector = applySpec<Selector>({
  storeProfession: selectFromAppData('profession', null),
  storeAnswers: selectFromAppData('answers', []),
  storeQuestions: selectFromAppData('questions', []),
  storeCurrentIdQuestion: selectFromAppData('currentIdQuestion', []),
});

export default function MyQuestions() {
  const { t } = useTranslation();
  const session = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch()

  const {
    storeProfession,
    storeAnswers,
    storeQuestions,
    storeCurrentIdQuestion
  } = useSelector<StoreState, Selector>(selector, fastDeepEqual);

  const [localData, setLocalData] = useState<ICategory[]>([]); // категории из localStorage
  const [nameQuestion, setNameQuestion] = useState('');   // nameQuestion - вопрос для передачи в отчет
  const [nameBlock, setNameBlock] = useState('');   // nameBlock - название раздела вопросов для передачи в отчет
  const [dataReport, setDataReport] = useState<DataReport | null>(null); // отправляем и в гугл таблицу и на страницу reports
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isActiveBtn, setIsActiveBtn] = useState(false); // активируем кнопку отчет
  const [currentIdQuestion, setCurrentIdQuestion] = useState(''); // определяем активные(раскрытые) вопросы по id
  const [filteredAnswers, setFilteredAnswers] = useState<IAnswer[]>([]);
  const [loading, setLoading] = useState(false); // показывает лоадер когда чатГПТ делает вывод
  const [form, setForm] = useState({
    name: '',
    question: '',
    mark: '',
    comment: '',
  });

  const isBrowser = typeof window !== 'undefined'; // Проверяем, что код выполняется в браузерной среде
  const local = isBrowser ? localStorage.getItem('choosenCategories') ?? '' : '';

  useEffect(() => { //если не зареган, переходим на окно регистрации
    session.status === 'unauthenticated' && router.push('/signin');
  }, [session]);

  useEffect(() => { // получаем выбранные категории из localstorage
    local && setLocalData(JSON.parse(local))
  }, [local])

  useEffect(() => { // при получении первой оценки активируем кнопку отчет
    form.mark && setIsActiveBtn(true)
  }, [form])

  useEffect(() => {
    if (localData && storeQuestions.length <= 0) {
      dispatch({ type: 'actionType/getAllQuestions' });
      dispatch({ type: 'actionType/getAllAnswers' });
    }
  }, [localData])

  useEffect(() => { // nameBlock для первого вопроса
    localData.length > 0 && setNameBlock(localData[0]?.title)
  }, [localData])

  useEffect(() => { // nameQuestion для первого вопроса
    if (localData.length > 0) {
      const initialIdQuestion = localData.length > 0 ? localData[0].questions[0] : '';
      const firstQuestion = storeQuestions.find(item => item.id === initialIdQuestion)
      if (firstQuestion)
        setNameQuestion(firstQuestion.text)
    }
  }, [storeQuestions, localData])

  useEffect(() => { // сохраняем в filteredAnswers только те ответы,id которых есть в вопросах
    if (storeQuestions.length > 0) {
      const set = new Set();
      storeQuestions.forEach((question: IQuestion) => {
        question.answers.forEach(item => { set.add(item) })
      });
      const arrayOfIds = Array.from(set); // получаем все id ответов со всех тем

      if (storeAnswers.length > 0) { // если в сторе есть ответы берем их оттуда
        const answersData = storeAnswers.filter((item) => arrayOfIds.includes(item.id))
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
      .then((data) => conclusion = data.choices[0].message.content)
      .catch((error) => console.error('Error:', error))
      .finally(() => setLoading(!loading));

    dataToGoogleSheets.push([`${conclusion}`, averageMark]);

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedDate = `${year}.${month}.${day} ${hours}:${minutes}`;

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
    flattenedDataToGoogleSheets.push(`Отчет был создан ${formattedDate}, email создателя - ${session.data?.user?.email}`)
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
  //
  const getCategoryTitle = (title: string) => { // получаем название категории для отчета
    setNameBlock(title)
  }

  useEffect(() => { // сохраняем поставленную оценку и коментарий для каждого вопроса при возвращении к нему
    Object.entries(dataReport || {}).forEach(([key, value]) => {
      if (key === nameBlock) {
        if (Array.isArray(value)) {
          const choosenQuestion = value.find(item => item[0] === nameQuestion);
          if (choosenQuestion) {
            const mark = typeof choosenQuestion[1] === 'string' ? choosenQuestion[1] : '';
            const comment = typeof choosenQuestion[2] === 'string' ? choosenQuestion[2] : '';
            setForm({
              ...form,
              mark,
              comment,
              question: nameQuestion,
            });
          }
        }
      }
    });
  }, [currentIdQuestion])

  return (
    <Box sx={{ ...MixinGridContainer }}>
      <StyledLeftContainer>
        <Search />
        <PageFormLeftSide getQuestionText={getQuestionText} getCategoryTitle={getCategoryTitle} pageName="interview" />
        <StyledBtnWrapper>
          <Button
            disabled={!isActiveBtn}
            onClick={() => setIsOpenModal(!isOpenModal)}
            sx={{ ...MixinBtn }}
          >
            {t('report')}
          </Button>
        </StyledBtnWrapper>
      </StyledLeftContainer>

      {storeProfession || localData
        ? <StyledRightContainer>
          <Box sx={{ position: 'relative', padding: '25px 90px 10px 90px' }}>

            {currentIdQuestion
              ? filteredAnswers.filter((item: IAnswer) => item.id === currentIdQuestion) // фильтруем Answers, берем только те что есть в currentIdQuestion
                .map((item: IAnswer) => (
                  <Markup
                    key={item.id}
                    content={item.text}
                  // TODO: добавить стили, когда появятся ответы
                  // sx={{
                  //   display: 'block',
                  //   maxHeight: 'calc(100vh - 285px)',
                  //   overflow: 'auto',
                  //   paddingBottom: '20px',
                  // }}
                  />
                ))
              : <Typography sx={{ marginTop: '80px', textAlign: 'center' }}>
                {t('chooseDirection')}
              </Typography>
            }

            {currentIdQuestion &&
              <StyledForm onSubmit={submitForm}>

                <Typography sx={{ marginTop: '20px', paddingLeft: '30px' }}>
                  {t('rateAnswerFrom0To100')}
                </Typography>
                <Box
                  sx={{
                    ...MixinFlexCenter,
                    justifyContent: 'space-around',
                    margin: '12px auto 40px auto',
                  }}>
                  {arrMarks.map(mark => (
                    <Box
                      key={mark}
                      sx={{
                        display: 'flex',
                        width: '50px',
                        '&:not(:last-child)': {
                          marginRight: '10px',
                        }
                      }}
                    >
                      <input
                        type="radio"
                        id={`mark${mark}`}
                        name="mark"
                        value={mark}
                        checked={form.mark === mark}
                        onChange={handleChange}
                        style={{ display: 'none' }}
                      />
                      <StyledRadioLabel
                        htmlFor={`mark${mark}`}
                        tabIndex={0}
                        mark={mark}
                        isChecked={form.mark === mark}
                      >
                        {mark}
                      </StyledRadioLabel>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ position: 'relative' }}>
                  <StyledTextareaLabel>{t('addComment')}</StyledTextareaLabel>
                  <StyledTextarea
                    name="comment"
                    placeholder="Комментарий"
                    value={form.comment}
                    onChange={handleChange}
                  />
                </Box>

                {isOpenModal &&
                  <StyledModalWindow>
                    <StyledModalWindowContainer>
                      <StyledModalWindowClear onClick={() => setIsOpenModal(!isOpenModal)} />
                      <StyledModalWindowInput
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Введите имя претендента"
                        required
                      />
                      <Button sx={{ ...MixinBtn }} type="submit">{t('goToReport')}</Button>
                      {loading &&
                        <StyledModalWindowLoading>
                          <Typography>{t('generatingReport')}</Typography>
                          <StyledModalWindowLoader />
                        </StyledModalWindowLoading>
                      }
                    </StyledModalWindowContainer>
                  </StyledModalWindow>
                }
              </StyledForm>}

          </Box>
        </StyledRightContainer>

        :
        <StyledRightSide>
          <Box
            sx={{
              marginTop: '140px',
              ...MixinFlexCenter,
              flexDirection: 'column',
            }}>
            <Typography sx={{ marginBottom: '45px', fontSize: '18px' }}>
              {t('selectSpecialization')}
            </Typography>
            <StyledLink href='/'>{t('letsGetStarted')}</StyledLink>
          </Box>
        </StyledRightSide>
      }
    </Box>
  )
}

