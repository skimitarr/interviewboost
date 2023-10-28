'use client'
import { useCallback, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks'
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { getCurrentIdQuestion } from '../store/slices/app-data.slice';
import { ICategory, ILeftPart, IQuestion } from "../components/Types";

export default function PageForm__leftSide({ getQuestionText, getCategoryTitle, pageName }: ILeftPart) {
  const [сurrentIdQuestion, setСurrentIdQuestion] = useState('0'); // используем для выделения цветом текущего вопроса
  const [activeCategoriesName, setActiveCategoriesName] = useState<string[]>([]); // определяем активные(раскрытые) категории (html css)
  const [storeCategories, setStoreCategories] = useState<ICategory[]>([]); // получаем категории из categoriesFromStore или из localStorage
  const [showHighliting, setShowHighliting] = useState<boolean>(false); // флаг для выделения цветом текущего вопроса на странице форм
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const dispatch = useAppDispatch();
  const storeQuestions = useAppSelector((state) => state.questions);
  const storeCurrentIdQuestion = useAppSelector((state) => state.currentIdQuestion);
  const categoriesFromStore = useAppSelector((state) => state.categories);
  const initialIdQuestion = storeCategories.length > 0 ? storeCategories[0].questions[0] : '';

  useEffect(() => {
    setQuestions(storeQuestions)
  }, [storeQuestions]);

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
    const category = storeCategories.find(item => item.questions.includes(сurrentIdQuestion))
    if (category?.title) {
      if (pageName !== 'interview') {
        setActiveCategoriesName([...activeCategoriesName, category.title]) // добавляем categoryTitle в массив открытых категорий для страницы questions
      } else {
        if (activeCategoriesName.length <= 1 && category.title !== activeCategoriesName[0]) { // заменяем categoryTitle в массиве открытых категорий для страницы interview
          setActiveCategoriesName([category.title])
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

  const handleDragEnd = (result: DropResult, category: ICategory) => {
    if (!result.destination) {
      return;
    }
    const newQuestions = [...questions];
    const sourceIndex = newQuestions.findIndex((q) => q.id === result.draggableId);
    const filteredQuestions = newQuestions.filter((item) => category.questions.includes(item.id));
    const destinationQuestion = filteredQuestions.find((q, index) => index === result.destination?.index);
    const destinationIndex = newQuestions.findIndex((q) => q.id === destinationQuestion?.id);
    const [reorderedItem] = newQuestions.splice(sourceIndex, 1);
    newQuestions.splice(destinationIndex, 0, reorderedItem);
    setQuestions(newQuestions);
  };

  const isActiveCategoryHandler = useCallback((categoryTitle: string) => {
    return activeCategoriesName.find(item => item === categoryTitle);
  }, [activeCategoriesName])

  return (
    <div className='questions__categories'>
      {storeCategories && storeCategories.map((category: ICategory) => {
        return (
          <DragDropContext onDragEnd={(result) => handleDragEnd(result, category)} key={category.id}>
            <div>
              <button className={`questions__choosenQuestions ${isActiveCategoryHandler(category.title) ? 'active' : ''}`} onClick={() => showQuestions(category.title)}>
                {category.title}
              </button>

              <Droppable droppableId="questions-list">
                {(provided) => (
                  <div ref={provided.innerRef}>
                    {activeCategoriesName.includes(category.title) &&
                      questions.filter((item) => category.questions.includes(item.id))
                        .map((question, index) => {
                          return (question ?
                            <Draggable key={question.id} draggableId={question.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <p
                                    className={`questions__technology-questions questions__leftQustions ${question.id === сurrentIdQuestion && showHighliting ? 'highlited' : ''} ${pageName === 'interview' ? 'cursor' : ''}`}
                                    onClick={() => handleQuestion(question.text, question.id)}
                                  >
                                    {index + 1}. {question.text}
                                  </p>
                                </div>
                              )}
                            </Draggable>
                            : null
                          )
                        })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        );
      })}
    </div>
  );
}

