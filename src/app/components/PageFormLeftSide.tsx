'use client'
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks'
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { addCategory, getCheckedQuestionDragDrop, getCurrentIdQuestion } from '../store/slices/app-data.slice';
import { ICategory, ILeftPart, IQuestion } from '../components/Types';
import { useDrop } from 'react-dnd';
import applySpec from 'ramda/es/applySpec';
import { useSelector } from 'react-redux';
import { StoreState } from '@/app/store/types';
import fastDeepEqual from 'fast-deep-equal';
import { selectFromAppData } from '@/app/store/selectors/data';
import { CategoryLeftSide } from './CategoryLeftSide';

type Selector = {
  storeAllCategories: ICategory[],
  categoriesFromStore: ICategory[],
  storeCurrentIdQuestion: string,
};

const selector = applySpec<Selector>({
  storeGrades: selectFromAppData('grades', []),
  storeAllCategories: selectFromAppData('allCategories', []),
  categoriesFromStore: selectFromAppData('categories', []),
  storeCurrentIdQuestion: selectFromAppData('currentIdQuestion', []),
});

type Props = {
  getQuestionText?: (title: string) => void
  getCategoryTitle?: (title: string) => void
  pageName?: string
};

export function PageFormLeftSide({ getQuestionText, getCategoryTitle, pageName }: Props) {
  const { storeCurrentIdQuestion, categoriesFromStore, storeQuestions  } = useSelector<StoreState, Selector>(selector, fastDeepEqual);

  const [сurrentIdQuestion, setСurrentIdQuestion] = useState('0'); // используем для выделения цветом текущего вопроса
  const [activeCategoriesName, setActiveCategoriesName] = useState<string[]>([]); // определяем активные(раскрытые) категории (html css)
  const [storeCategories, setStoreCategories] = useState<ICategory[]>([]); // получаем категории из categoriesFromStore или из localStorage
  const [showHighliting, setShowHighliting] = useState<boolean>(false); // флаг для выделения цветом текущего вопроса на странице собеседование
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const dispatch = useAppDispatch();

  const initialIdQuestion = storeCategories.length > 0 ? storeCategories[0].questions[0] : '';

  useEffect(() => {
    setQuestions(storeQuestions)
  }, [storeQuestions]);

  useEffect(() => {
    dispatch(getCurrentIdQuestion(initialIdQuestion));
  }, [initialIdQuestion]);

  useEffect(() => {
    if (pageName === 'interview') {
      if (activeCategoriesName.length > 0) {
        const choosenCategory = storeCategories.find(item => item.title === activeCategoriesName[0])
        dispatch(getCurrentIdQuestion(choosenCategory?.questions[0]));
      }
    }
  }, [activeCategoriesName]);

  useEffect(() => { // получаем сurrentIdQuestion
    if (storeCurrentIdQuestion && сurrentIdQuestion && initialIdQuestion) {
      if (pageName !== 'interview' && storeCurrentIdQuestion !== сurrentIdQuestion && storeCurrentIdQuestion !== initialIdQuestion) { // showHighliting true если проводим поиск в вопросах
        setShowHighliting(true);
      }
    }
    if (pageName === 'interview') { // showHighliting true если проводим поиск в вопросах
      setShowHighliting(true);
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
      const result = activeCategoriesName.filter(item => item !== categoryTitle)
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

  const isActiveCategoryHandler = useCallback((categoryTitle: string) => {
    return activeCategoriesName.find(item => item === categoryTitle);
  }, [activeCategoriesName])

  const [, dropQuestions] = useDrop(() => ({ // хук Drag&Drop
    accept: 'inputRightSide',
    drop({ id: sourceId, category, categoriesFromStore, checked }:
      { id: string; type: string; category: ICategory, categoriesFromStore: ICategory[], checked: boolean }) {
      !checked ? addDragDropQuestion(category, sourceId, categoriesFromStore) : null
    },
  }));

  const addDragDropQuestion = (category: ICategory, sourceId: string, categoriesFromStore: ICategory[]) => { // логика добавления вопросов(и категорий) Drag&Drop
    const updatedCategory = categoriesFromStore.find(item => item.id === category.id);
    if (updatedCategory) {
      const updatedCategoryWithQuestions = {
        ...updatedCategory,
        questions: updatedCategory.questions ? [...updatedCategory.questions, sourceId] : [sourceId],
      };
      dispatch(addCategory(updatedCategoryWithQuestions));
    } else {
      const updatedCategory = { ...category, questions: [sourceId] };
      dispatch(addCategory(updatedCategory));
    }

    dispatch(getCheckedQuestionDragDrop(sourceId));
  }

  const dragDropElement = (sourceId: string, destinationId: string, func: any) => {
    func((prevState: any) => {
      const newStateArray = [...prevState];
      const sourceIndex = newStateArray.findIndex(q => q.id === sourceId);
      const destinationIndex = newStateArray.findIndex(q => q.id === destinationId);

      const [reorderedItem] = newStateArray.splice(sourceIndex, 1);
      newStateArray.splice(destinationIndex, 0, reorderedItem);

      return newStateArray;
    });
  };

  return (
    <div className='questions__categories' ref={dropQuestions}>
      {storeCategories && storeCategories.map((category: ICategory) =>
        <CategoryLeftSide key={category.id}
          category={category}
          isActiveCategoryHandler={isActiveCategoryHandler}
          showQuestions={showQuestions}
          activeCategoriesName={activeCategoriesName}
          questions={questions.filter((item) => category.questions.includes(item.id))}
          сurrentIdQuestion={сurrentIdQuestion}
          showHighliting={showHighliting}
          pageName={pageName}
          dragDropElement={dragDropElement}
          handleQuestion={handleQuestion}
          setQuestions={setQuestions}
          setStoreCategories={setStoreCategories}
        />
      )}
    </div>
  );
}
