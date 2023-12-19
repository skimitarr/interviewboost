'use client'
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import applySpec from 'ramda/es/applySpec';
import fastDeepEqual from 'fast-deep-equal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  addCategory,
  removeCategory,
  setActiveCategory,
  setCheckedCategoriesIds,
  setQuestions
} from '@/app/store/slices/app-data.slice';
import { selectFromAppData, selectQuestionByCategory } from '@/app/store/selectors/data';
import { StoreState } from '@/app/store/types';
import { MemoizedCategoryRightSide } from '@/app/components/CategoryRightSide/CategoryRghtSide';
import { InputQuestion } from '../InputQuestion/InputQuestion';
import { SelectAllQuestions } from '../SelectAllQuestions';
import { MixinFlexCenter } from '@/styles/mixins';
import { StyledCategories, StyledLink, StyledRightSide } from './style';
import {
  ICategory,
  IQuestion,
  IProffesion,
  CheckedQuestionDragDrop
} from '../Types';

type Selector = {
  storeProfession: IProffesion | null,
  storeCategories: ICategory[],
  storeQuestions: IQuestion[],
  checkedIdQuestionDragDrop: CheckedQuestionDragDrop,
  checkedCategoriesIds: Array<string>,
  activeCategory: ICategory,
  categoriesByGrade: ICategory[],
  questions: IQuestion[],
};

const selector = applySpec<Selector>({
  storeProfession: selectFromAppData('profession', null),
  storeCategories: selectFromAppData('categories', []),
  checkedIdQuestionDragDrop: selectFromAppData('checkedQuestionDragDrop', { id: '', timestamp: 0 }),
  checkedCategoriesIds: selectFromAppData('checkedCategoriesIds', []),
  activeCategory: selectFromAppData('activeCategory', null),
  categoriesByGrade: selectFromAppData('categoriesByGrade', []),
  questions: selectQuestionByCategory,
});

export function PageFormRightSide() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    storeProfession,
    storeCategories,
    checkedIdQuestionDragDrop,
    checkedCategoriesIds,
    activeCategory,
    categoriesByGrade,
    questions,
  } = useSelector<StoreState, Selector>(selector, fastDeepEqual);

  const [categoriesForStore, setCategoriesForStore] = useState<ICategory[]>([]); // тут убираем/добавляем вопросы
  const [checkedIdQuestions, setCheckedIdQuestions] = useState<string[]>([]); // массив id вопросов которые checked

  useEffect(() => { // получаем categories
    if (categoriesByGrade.length > 0) {
      setCategoriesForStore(categoriesByGrade);
    }
  }, [categoriesByGrade])


  useEffect(() => { // получаем questions из стора с правильно активированными чекбоксами
    if (storeCategories.length > 0) {
      const selectedQuestions = storeCategories.flatMap((category) => category.questions); // получаем questions из стора
      const missingCategories = categoriesByGrade.filter(category => !storeCategories.some(storeCategory => storeCategory.id === category.id));
      const missingQuestions = missingCategories.flatMap((category) => category.questions); // получаем questions из других катег что нет в сторе
      const allSelectedQuestions = [...selectedQuestions, ...missingQuestions];
      setCheckedIdQuestions(allSelectedQuestions);
    } else {
      const selectedQuestions = categoriesByGrade.flatMap((category) => category.questions); // если в сторе ничего нет
      setCheckedIdQuestions(selectedQuestions);
    }
  }, [categoriesByGrade])

  const showQuestions = useCallback((category: ICategory) => {
    dispatch(setActiveCategory(
      activeCategory.id === category.id
        ? { id: '', title: '', questions: [] }
        : category
    ))
  }, [categoriesByGrade]);

  const addStoreCategory = (category: ICategory) => {
    const updatedQuestions: string[] = [];
    category.questions.forEach(element => {
      if (checkedIdQuestions.includes(element)) {
        updatedQuestions.push(element)
      }
    });
    const updatedCategory = { ...category, questions: updatedQuestions };
    dispatch(addCategory(updatedCategory));
  }

  const removeStoreCategory = (category: ICategory) => {
    dispatch(removeCategory(category))
  }

  useEffect(() => { // получаем id вопроса, который перетащили в левую часть и он станет checked
    setCheckedIdQuestions(prev => [...prev, checkedIdQuestionDragDrop.id]);
    const currentCategoriesForStore = categoriesForStore.find(item => item.id === checkedIdQuestionDragDrop.id);
    if (currentCategoriesForStore) {
      selectQuestions(checkedIdQuestionDragDrop.id, currentCategoriesForStore);
    }
  }, [checkedIdQuestionDragDrop])

  const selectQuestions = (questionId: string, questionCategory: ICategory) => { // добавляем/убираем вопросы
    if (checkedIdQuestions.includes(questionId)) { //если вопрос активный, деактивируем его
      const result = checkedIdQuestions.filter(item => item !== questionId);
      setCheckedIdQuestions(result);
      selectQuestionsLogic(questionCategory, result); // вводим result из-за асинхронщины
    } else {
      setCheckedIdQuestions(prev => [...prev, questionId]); //и наоборот
      selectQuestionsLogic(questionCategory, [...checkedIdQuestions, questionId].sort((a: string, b: string) => +a - +b));
    }
  }

  const selectQuestionsLogic = (questionCategory: ICategory, checkedIdQuestions: string[]) => {
    const currentCategoriesForStore = categoriesByGrade.find(item => item.id === questionCategory.id); // нужная категория
    if (currentCategoriesForStore) {
      const updatedQuestions: string[] = [];
      currentCategoriesForStore.questions.forEach(element => {
        if (checkedIdQuestions.includes(element)) {
          updatedQuestions.push(element)
        }
      });

      const updatedCategory = { ...questionCategory, questions: updatedQuestions }; // Создаем новый объект категории, чтобы избежать изменения исходного объекта
      const restCategoriesForStore = categoriesForStore.filter(item => item.id !== questionCategory.id);
      setCategoriesForStore([...restCategoriesForStore, updatedCategory]);

      if (storeCategories.some(item => item.id === questionCategory.id)) { // если есть категории в сторе
        dispatch(addCategory(updatedCategory));
      }
    }

    if (checkedIdQuestions.length === 0) { // чтобы не возникало ошибки при обращении к firestore
      return;
    }
  }

  // TODO: на рефактор selectAllQuestions
  const selectAllQuestions = useCallback((categoryId: string, stateButtonAllQuestions: boolean) => { // добавляем/убираем все вопросы
    const currentCheckedCategoriesIds = checkedCategoriesIds.includes(categoryId) // меняем состояние самой кнопки
      ? checkedCategoriesIds.filter((item) => item !== categoryId)
      : [...checkedCategoriesIds, categoryId];
    dispatch(setCheckedCategoriesIds(currentCheckedCategoriesIds));

    let currentCategoriesForStore = categoriesByGrade.find(item => item.id === categoryId); // нужная категория
    const restCategoriesForStore = categoriesForStore.filter(item => item.id !== categoryId); // остальные категории

    if (currentCategoriesForStore) {
      if (stateButtonAllQuestions) {
        const temp = checkedIdQuestions;
        currentCategoriesForStore.questions.forEach(item => {
          if (!checkedIdQuestions.includes(item)) {
            temp.push(item)
          }
        })
        setCheckedIdQuestions(temp)
      } else {
        const copy = checkedIdQuestions;
        currentCategoriesForStore.questions.forEach(item => {
          const index = copy.findIndex((i) => i === item);
          if (index !== -1) { // Если объект найден, удаляем его из массива
            copy.splice(index, 1);
          }
        })
        setCheckedIdQuestions(copy);
        const temp = JSON.parse(JSON.stringify(currentCategoriesForStore.questions)); //удаляем вопросы для передачи в стор
        temp.length = 0;
        currentCategoriesForStore = { ...currentCategoriesForStore, questions: temp };
      }

      setCategoriesForStore([...restCategoriesForStore, currentCategoriesForStore]);

      if (storeCategories.some(item => item.id === categoryId)) { // если есть категории в сторе
        dispatch(addCategory(currentCategoriesForStore));
      }
    }

    if (checkedIdQuestions.length === 0) { // чтобы не возникало ошибки при обращении к firestore
      return;
    }
  }, [])

  const dragDropElement = (sourceId: string, destinationId: string, func: any) => {
    func(() => {
      const newStateArray = [...categoriesByGrade];
      console.log(sourceId, destinationId);
      const sourceIndex = newStateArray.findIndex((q: any) => q.id === sourceId);
      const destinationIndex = newStateArray.findIndex((q: any) => q.id === destinationId);
      console.log(sourceIndex, sourceIndex);
      const [reorderedItem] = newStateArray.splice(sourceIndex, 1);
      newStateArray.splice(destinationIndex, 0, reorderedItem);

      return newStateArray;
    });
  };

  console.log('render')

  return (
    storeProfession
      ? <StyledRightSide>
        {/* TODO: добавить кнопки джун мидл сеньйор */}
        {/* <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          {grades && grades.map(item => {
            return <StyledBtn
              key={item.id}
              onClick={() => setActiveGradeName(item.title)}
              $active={activeGradeName === item.title}
            >
              {item.title}
            </StyledBtn>
          })}
        </Box> */}

        <Typography
          sx={({ custom }) => ({
            padding: '20px 0',
            backgroundColor: custom.colorTwilightSlate,
            textAlign: 'center',
            fontSize: '16px',
          })}
        >
          {t('selectATechnologyStack')}
        </Typography>
        <StyledCategories>
          {categoriesByGrade.map(category =>
            <MemoizedCategoryRightSide
              key={category.id}
              category={category}
              activeCategoryId={activeCategory.id}
              showQuestions={showQuestions}
              removeStoreCategory={removeStoreCategory}
              addStoreCategory={addStoreCategory}
              dragDropElement={dragDropElement}
             />
          )}
        </StyledCategories>
        {activeCategory &&
          <Box sx={({ custom }) => ({
            padding: ' 25px 0 0 35px',
            backgroundImage: custom.colorBackgroundGradient
          })}
          >
            <SelectAllQuestions
              category={activeCategory}
              onSelectAll={selectAllQuestions}
              checkedIdAllQuestions={checkedCategoriesIds}
            />
            {questions
              .map((item, index) => (
                <InputQuestion
                  key={item.id}
                  item={item}
                  index={index}
                  category={activeCategory}
                  selectQuestions={selectQuestions}
                  checkedIdQuestions={checkedIdQuestions}
                  dragDropElement={dragDropElement}
                  setQuestions={setQuestions}
                />
              ))}
          </Box>}

      </StyledRightSide>
      : <StyledRightSide>
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
  )
}
