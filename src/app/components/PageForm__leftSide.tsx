'use client'
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks'
// import { getDbQuestions } from '../../services/DatabaseService'
import { getCurrentIdQuestion, getQuestions } from '../store/DataSlice';
import { ICategory, IQuestion, ILeftPart } from "../components/Types";
// import Link from 'next/link';
// import translitRusEng from 'translit-rus-eng';

export default function PageForm__leftSide({ getQuestionText, getCategoryTitle, pageName }: ILeftPart) {
  const [сurrentIdQuestion, setСurrentIdQuestion] = useState('0'); // используем для выделения цветом текущего вопроса
  const [activeCategoriesName, setActiveCategoriesName] = useState<string[]>([]); // определяем активные(раскрытые) категории (html css)
  const [storeCategories, setStoreCategories] = useState<ICategory[]>([]); // получаем категории из categoriesFromStore или из localStorage
  const [showHighliting, setShowHighliting] = useState<boolean>(false); // флаг для выделения цветом текущего вопроса на странице форм

  const dispatch = useAppDispatch();
  const storeQuestions = useAppSelector((state) => state.questions);
  const storeCurrentIdQuestion = useAppSelector((state) => state.currentIdQuestion);
  const categoriesFromStore = useAppSelector((state) => state.categories);
  const initialIdQuestion = storeCategories.length > 0 ? storeCategories[0].questions[0] : '';

  // console.log(translitRusEng(storeQuestions[0].text, { slug: true }))

  useEffect(() => {
    dispatch(getCurrentIdQuestion(initialIdQuestion));
  }, [initialIdQuestion]);


  useEffect(() => {
    if (pageName === 'interview') {
      const choosenCategory = storeCategories.find(item => item.title === activeCategoriesName[0])
      dispatch(getCurrentIdQuestion(choosenCategory?.questions[0]));
    }
  }, [activeCategoriesName]);

  useEffect(() => { // получаем сurrentIdQuestion
    if (storeCurrentIdQuestion && сurrentIdQuestion && initialIdQuestion) {
      if (pageName !== 'interview' && storeCurrentIdQuestion !== сurrentIdQuestion && storeCurrentIdQuestion !== initialIdQuestion) { // showHighliting true если проводим поиск в вопросах
        setShowHighliting(true);
      }
    }
    setСurrentIdQuestion(storeCurrentIdQuestion) // для для выделения цветом текущего вопроса из поиска
  }, [storeCurrentIdQuestion])

  useEffect(() => { // получаем категории из categoriesFromStore или из localStorage
    if (pageName === "interview") { // pageName нужен, чтобы получать категории из localStorage только на этой странице
      if (categoriesFromStore.length > 0) {
        setStoreCategories(categoriesFromStore)
      } else {
        const localStorageCategories = JSON.parse(localStorage.getItem('choosenCategories') ?? '[]');
        setStoreCategories(localStorageCategories);
      }
    } else {
      setStoreCategories(categoriesFromStore)
    }
  }, [categoriesFromStore]);

  useEffect(() => { // открываем список вопросов, когда изменяется сurrentIdQuestion
    function getCategoryTitleFromCurrentIdAnswer(currentIdAnswer: string) {
      const category = storeCategories.find(item => item.questions.includes(currentIdAnswer))
      // console.log(category)
      if (category) {
        return category.title;
      }
    }
    const categoryTitle = getCategoryTitleFromCurrentIdAnswer(сurrentIdQuestion);
    // if (categoryTitle) {
    //   setActiveCategoriesName([...activeCategoriesName, categoryTitle]) // добавляем categoryTitle в массив открытых категорий
    // }
    if (categoryTitle) {
      if (pageName !== 'interview') {
        setActiveCategoriesName([...activeCategoriesName, categoryTitle]) // добавляем categoryTitle в массив открытых категорий для страницы questions
      } else {
        if (activeCategoriesName.length <= 1 && categoryTitle !== activeCategoriesName[0]) { // заменяем categoryTitle в массиве открытых категорий для страницы interview
          setActiveCategoriesName([categoryTitle])
        } return // если уже есть, ничего не делаем
      }
    }
  }, [сurrentIdQuestion]);

  const showQuestions = (categoryTitle: string) => {
    if (getCategoryTitle) { //сохраняем categoryTitle для передачи в родит. компонент
      getCategoryTitle(categoryTitle);
    }

    if (activeCategoriesName.includes(categoryTitle)) { //если вопросы открыты, скрываем их
      let result = activeCategoriesName.filter(item => item !== categoryTitle)
      setActiveCategoriesName(result)
    } else {
      if (pageName !== 'interview') {
        setActiveCategoriesName([...activeCategoriesName, categoryTitle]) //если вопросы закрыты, откываем их
      } else {
        setActiveCategoriesName([categoryTitle]) //если вопросы закрыты, откываем их
      }
    }
  }

  const getQuestion = (questionId: string) => { // открываем вопрос по клику из результата поиска через handleQuestion
    storeCategories.find((category: ICategory) => {
      if (category.questions.includes(questionId))
        if (activeCategoriesName.includes(category.title)) { //если вопросы открыты, ничего не делаем
          return
        } else {
          if (pageName !== 'interview') {
            setActiveCategoriesName([...activeCategoriesName, category.title]) //если вопросы закрыты, откываем их
          } else {
            setActiveCategoriesName([category.title]) //если вопросы закрыты, откываем их
          }
        }
    })
  }

  const handleQuestion = (questionText: string, questionId: string) => { //передаем данные question в стор
    setСurrentIdQuestion(questionId) // получаем сurrentIdQuestion
    getQuestion(questionId) // запускаем предыдущую функцию
    setShowHighliting(false) // на странице форм по клику убираем подсветку
    dispatch(getCurrentIdQuestion(questionId)) //передаем данные questionId в стор
    if (getQuestionText) { //передаем questionText в родит. компонент
      getQuestionText(questionText);
    }
  }

  return (
    <div className='questions__categories'>
      {storeCategories && storeCategories.map((category: ICategory) => {
        const isActive = activeCategoriesName.find(item => item === category.title);
        return <div key={category.id}>
          <button className={`questions__choosenQuestions ${isActive ? 'active' : ''}`} onClick={() => showQuestions(category.title)}>{category.title}</button>

          <div>
            {activeCategoriesName.includes(category.title)
              ? storeQuestions.filter((question: IQuestion) => {
                return category.questions.some((el) => { // фильтруем questions, берем только те что есть в category
                  return question.id === el;
                });
              })
                .map((question: IQuestion, index: number) => {
                  return pageName !== 'interview'
                    ?
                    <p key={question.id}
                      className={`questions__technology-questions questions__leftQustions ${question.id === сurrentIdQuestion && showHighliting ? 'highlited' : ''} ${pageName === 'interview' ? 'cursor' : ''}`}
                      onClick={() => handleQuestion(question.text, question.id)}
                    >
                      {index + 1}. {question.text}
                    </p>
                    :
                    <p key={question.id}
                      className={`questions__technology-questions questions__leftQustions ${question.id === сurrentIdQuestion ? 'highlited' : ''} ${pageName === 'interview' ? 'cursor' : ''}`}
                      onClick={() => handleQuestion(question.text, question.id)}
                    >
                      {index + 1}. {question.text}
                    </p>;
                })
              : ''}
          </div>

        </div>
      })}
    </div>
  )
}

// <Link
//   key={question.id}
//   onClick={() => handleQuestion(question.text, question.id)}
//   href={``}
//   className={`questions__technology-questions questions__leftQustions ${question.id === сurrentIdQuestion && showHighliting ? 'highlited' : ''}`}
// >{index + 1}. {question.text}
// </Link>


// <Link
//   key={question.id}
//   onClick={() => handleQuestion(question.text, question.id)}
//   href={`/interview/${question.id}`}
//   className={`questions__technology-questions questions__leftQustions ${question.id === сurrentIdQuestion ? 'highlited' : ''}`}
// >{index + 1}. {question.text}</Link>
