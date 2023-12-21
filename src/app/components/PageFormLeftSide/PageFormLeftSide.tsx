'use client'
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import { useRouter } from "next/navigation";
import { useAppDispatch } from '../../hooks'
import { useTranslation } from "react-i18next";
import applySpec from 'ramda/es/applySpec';
import fastDeepEqual from 'fast-deep-equal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { selectFromAppData } from '@/app/store/selectors/data';
import { StoreState } from '@/app/store/types';
import { addCategory, getCheckedQuestionDragDrop, getCurrentIdQuestion } from '../../store/slices/app-data.slice';
import { ICategory, IQuestion } from "../Types";
import { CategoryLeftSide } from '../CategoryLeftSide/CategoryLeftSide';
import { StyledBtnWrapper } from './style';
import { MixinBtn } from '@/styles/mixins';

type Selector = {
  storeQuestions: IQuestion[],
  categoriesFromStore: ICategory[],
  storeCurrentIdQuestion: string,
};

const selector = applySpec<Selector>({
  storeQuestions: selectFromAppData('questions', []),
  categoriesFromStore: selectFromAppData('categories', []),
  storeCurrentIdQuestion: selectFromAppData('currentIdQuestion', []),
});

type Props = {
  getQuestionText?: (title: string) => void
  getCategoryTitle?: (title: string) => void
  pageName?: string
};

export function PageFormLeftSide({ getQuestionText, getCategoryTitle, pageName }: Props) {
  const { storeCurrentIdQuestion, categoriesFromStore, storeQuestions } = useSelector<StoreState, Selector>(selector, fastDeepEqual);

  const [currentIdQuestion, setCurrentIdQuestion] = useState('0'); // используем для выделения цветом текущего вопроса
  const [activeCategoriesName, setActiveCategoriesName] = useState<string[]>([]); // определяем активные(раскрытые) категории (html css)
  const [storeCategories, setStoreCategories] = useState<ICategory[]>([]); // получаем категории из categoriesFromStore или из localStorage
  const [showHighliting, setShowHighliting] = useState<boolean>(false); // флаг для выделения цветом текущего вопроса на странице собеседование
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initialIdQuestion = storeCategories.length > 0 ? storeCategories[0].questions[0] : '';

  useEffect(() => {
    setQuestions(storeQuestions)
  }, [storeQuestions]);

  useEffect(() => {
    dispatch(getCurrentIdQuestion(initialIdQuestion));
  }, [initialIdQuestion]);

  useEffect(() => {
    if (pageName === 'interview' && activeCategoriesName.length > 0) {
      const choosenCategory = storeCategories.find(item => item.title === activeCategoriesName[0])
      dispatch(getCurrentIdQuestion(choosenCategory?.questions[0]));
    }
  }, [activeCategoriesName]);

  useEffect(() => { // получаем currentIdQuestion
    if (storeCurrentIdQuestion && currentIdQuestion && initialIdQuestion) {
      if (pageName !== 'interview' && storeCurrentIdQuestion !== currentIdQuestion && storeCurrentIdQuestion !== initialIdQuestion) { // showHighliting true если проводим поиск в вопросах
        setShowHighliting(true);
      }
    }
    if (pageName === 'interview') { // showHighliting true если проводим поиск в вопросах
      setShowHighliting(true);
    }
    setCurrentIdQuestion(storeCurrentIdQuestion) // для для выделения цветом текущего вопроса из поиска
  }, [storeCurrentIdQuestion])

  useEffect(() => { // получаем категории из categoriesFromStore или из localStorage
    if (pageName === "interview") { // pageName нужен, чтобы получать категории из localStorage только на этой странице
      const localStorageCategories = JSON.parse(localStorage.getItem('choosenCategories') ?? '[]');
      setStoreCategories(categoriesFromStore.length > 0
        ? categoriesFromStore
        : localStorageCategories)
    } else {
      setStoreCategories(categoriesFromStore)
    }
  }, [categoriesFromStore]);

  useEffect(() => { // открываем список вопросов, когда изменяется currentIdQuestion
    const category = storeCategories.find(item => item.questions.includes(currentIdQuestion))
    if (category?.title) {
      if (pageName !== 'interview') {
        if (!activeCategoriesName.includes(category.title)) {
          setActiveCategoriesName([...activeCategoriesName, category.title])  // добавляем categoryTitle в массив открытых категорий для страницы questions
        }
      } else {
        if (activeCategoriesName.length <= 1 && category.title !== activeCategoriesName[0]) { // заменяем categoryTitle в массиве открытых категорий для страницы interview
          setActiveCategoriesName([category.title])
        } return // если уже есть, ничего не делаем
      }
    }
  }, [currentIdQuestion]);

  const showQuestions = (categoryTitle: string) => {
    getCategoryTitle && getCategoryTitle(categoryTitle); // для передачи в родит. компонент

    if (activeCategoriesName.includes(categoryTitle)) { //если вопросы открыты, скрываем их
      const result = activeCategoriesName.filter(item => item !== categoryTitle)
      setActiveCategoriesName(result)
    } else {
      setActiveCategoriesName(pageName !== 'interview'  //если вопросы закрыты, откываем их
        ? [...activeCategoriesName, categoryTitle]
        : [categoryTitle]
      )
    }
  }

  const handleQuestion = (questionText: string, questionId: string) => { //передаем данные question в стор
    setCurrentIdQuestion(questionId) // получаем currentIdQuestion
    setShowHighliting(false) // на странице форм по клику убираем подсветку
    dispatch(getCurrentIdQuestion(questionId)) //передаем данные questionId в стор
    getQuestionText && getQuestionText(questionText); //передаем questionText в родит. компонент
  }

  const isActiveCategoryHandler = useCallback((categoryTitle: string) => {
    return activeCategoriesName.some(item => item === categoryTitle);
  }, [activeCategoriesName])

  const [, dropQuestions] = useDrop(() => ({ // хук Drag&Drop
    accept: 'inputRightSide',
    drop({ id: sourceId, category, categoriesFromStore, checkedIdQuestions }:
      { id: string; type: string; category: ICategory, categoriesFromStore: ICategory[], checkedIdQuestions: string[] }) {
      !checkedIdQuestions.includes(sourceId) ? addDragDropQuestion(category, sourceId, categoriesFromStore, checkedIdQuestions) : null
    },
  }));

  const addDragDropQuestion = (category: ICategory, sourceId: string, categoriesFromStore: ICategory[], checkedIdQuestions: string[]) => { // логика добавления вопросов(и категорий) Drag&Drop
    const updatedCategory = categoriesFromStore.find(item => item.id === category.id);
    dispatch(addCategory(updatedCategory
      ? { ...updatedCategory, questions: [...checkedIdQuestions, sourceId] }
      : { ...category, questions: [...checkedIdQuestions, sourceId] }
    ));

    dispatch(getCheckedQuestionDragDrop({ id: sourceId, timestamp: Date.now() }));
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

  const saveQuestions = () => {
    localStorage.setItem('choosenCategories', JSON.stringify(storeCategories));
    router.push('/interview');
  }

  return (
    <>
      <Box sx={{ padding: '0 27px', height: '80%' }} ref={dropQuestions}>
        {storeCategories && storeCategories.map((category: ICategory) =>
          <CategoryLeftSide
            key={category.id}
            category={category}
            isActiveCategoryHandler={isActiveCategoryHandler}
            showQuestions={showQuestions}
            activeCategoriesName={activeCategoriesName}
            questions={questions.filter((item) => category.questions.includes(item.id))}
            currentIdQuestion={currentIdQuestion}
            showHighliting={showHighliting}
            pageName={pageName}
            dragDropElement={dragDropElement}
            handleQuestion={handleQuestion}
            setQuestions={setQuestions}
            setStoreCategories={setStoreCategories}
          />
        )}
      </Box>

      <StyledBtnWrapper>
        <Button
          disabled={!storeCategories.length}
          onClick={saveQuestions}
          sx={{ ...MixinBtn }}
        >
          {t('save')}
        </Button>
      </StyledBtnWrapper>
    </>
  );
}
