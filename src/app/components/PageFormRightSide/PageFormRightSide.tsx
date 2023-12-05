'use client'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/hooks';
import { useTranslation } from 'react-i18next';
import applySpec from 'ramda/es/applySpec';
import fastDeepEqual from 'fast-deep-equal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { addCategory, removeCategory } from '@/app/store/slices/app-data.slice';
import { selectFromAppData } from '@/app/store/selectors/data';
import { StoreState } from '@/app/store/types';
import { CategoryRightSide } from '@/app/components/CategoryRightSide/CategoryRghtSide';
import { InputQuestion } from "../InputQuestion/InputQuestion";
import { SelectAllQuestions } from "../SelectAllQuestions";
import { MixinFlexCenter } from '@/css/variables';
import { StyledCategories, StyledLink, StyledRightSide } from './style';
import {
  IGrade,
  ICategory,
  IQuestion,
  IProffesion,
  CheckedQuestionDragDrop
} from '../Types';

type Selector = {
  storeProfession: IProffesion | null,
  storeGrades: IGrade[],
  storeAllCategories: ICategory[],
  storeCategories: ICategory[],
  storeQuestions: IQuestion[],
  checkedIdQuestionDragDrop: CheckedQuestionDragDrop,
};

const selector = applySpec<Selector>({
  storeProfession: selectFromAppData('profession', null),
  storeGrades: selectFromAppData('grades', []),
  storeAllCategories: selectFromAppData('allCategories', []),
  storeCategories: selectFromAppData('categories', []),
  storeQuestions: selectFromAppData('questions', []),
  checkedIdQuestionDragDrop: selectFromAppData('checkedQuestionDragDrop', { id: '', timestamp: 0 }),
});

export function PageFormRightSide() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch()

  const {
    storeProfession,
    storeGrades,
    storeAllCategories,
    storeCategories,
    storeQuestions,
    checkedIdQuestionDragDrop,
  } = useSelector<StoreState, Selector>(selector, fastDeepEqual);

  const [grades, setGrades] = useState<IGrade[]>([]); // массив (junior middle) с базы данных
  const [activeGradeName, setActiveGradeName] = useState<string>('Junior'); // определяем активую кнопку (junior middle) для стилизации
  const [categories, setCategories] = useState<ICategory[]>([]); // массив (html css) с базы данных
  const [categoriesForStore, setCategoriesForStore] = useState<ICategory[]>([]); // тут убираем/добавляем вопросы
  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null); // определяем активные(раскрытые) категории (html css)
  const [questions, setQuestions] = useState<IQuestion[]>([]); // массив всех вопросов с базы данных
  const [checkedIdQuestions, setCheckedIdQuestions] = useState<string[]>([]); // массив id вопросов которые checked
  const [checkedIdAllQuestions, setCheckedIdAllQuestions] = useState<string[]>([]); // массив категорий id выбрать все

  useEffect(() => {
    setActiveCategory(storeAllCategories[0]);
    const ids = storeAllCategories.map(item => item.id);
    setCheckedIdAllQuestions(ids);
  }, [storeAllCategories])

  useEffect(() => { // получаем grades
    setGrades(storeGrades);
  }, [storeGrades])

  useEffect(() => { // получаем categories
    if (grades.length > 0) {
      const filteredGrade = grades.find(grade => grade.title === activeGradeName);
      const categoriesData = storeAllCategories
        .filter((item) => filteredGrade?.categories.includes(item.id))
        .sort((a: ICategory, b: ICategory) => +a.id - +b.id);
      setCategories(categoriesData);
      setCategoriesForStore(categoriesData);
    }
  }, [grades, activeGradeName])

  useEffect(() => { // получаем questions
    if (categories.length > 0) {
      const set = new Set();
      categories.forEach(category => {
        category.questions.forEach(item => { set.add(item) })
      });
      const arrayOfIds = Array.from(set); // получаем все id вопросов со всех тем

      const questionsData = storeQuestions.filter((item) => arrayOfIds.includes(item.id))
      setQuestions(questionsData);
    }
  }, [categories])

  useEffect(() => { // получаем questions из стора с правильно активированными чекбоксами
    if (storeCategories.length > 0) {
      const selectedQuestions = storeCategories.flatMap((category) => category.questions); // получаем questions из стора
      const missingCategories = categories.filter(category => !storeCategories.some(storeCategory => storeCategory.id === category.id));
      const missingQuestions = missingCategories.flatMap((category) => category.questions); // получаем questions из других катег что нет в сторе
      const allSelectedQuestions = [...selectedQuestions, ...missingQuestions];
      setCheckedIdQuestions(allSelectedQuestions);
    } else {
      const selectedQuestions = categories.flatMap((category) => category.questions); // если в сторе ничего нет
      setCheckedIdQuestions(selectedQuestions);
    }
  }, [categories])

  const showQuestions = (category: ICategory) => {
    setActiveCategory(
      activeCategory && activeCategory.id === category.id
        ? { id: '', title: '', questions: [] }
        : category
    )
  }

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
    const currentCategoriesForStore = categories.find(item => item.id === questionCategory.id); // нужная категория
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
  const selectAllQuestions = (categoryId: string, statebuttonAllQuestions: boolean) => { // добавляем/убираем все вопросы
    setCheckedIdAllQuestions(checkedIdAllQuestions.includes(categoryId) // меняем состояние самой кнопки
      ? checkedIdAllQuestions.filter((item) => item !== categoryId)
      : [...checkedIdAllQuestions, categoryId])

    let currentCategoriesForStore = categories.find(item => item.id === categoryId); // нужная категория
    const restCategoriesForStore = categoriesForStore.filter(item => item.id !== categoryId); // остальные категории

    if (currentCategoriesForStore) {
      if (statebuttonAllQuestions) {
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
  }

  const dragDropElement = (sourceId: string, destinationId: string, func: any) => {
    func((prevState: any) => {
      const newStateArray = [...prevState];

      const sourceIndex = newStateArray.findIndex((q: any) => q.id === sourceId);
      const destinationIndex = newStateArray.findIndex((q: any) => q.id === destinationId);

      const [reorderedItem] = newStateArray.splice(sourceIndex, 1);
      newStateArray.splice(destinationIndex, 0, reorderedItem);

      return newStateArray;
    });
  };

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
        >{t('selectATechnologyStack')}</Typography>

        <StyledCategories>
          {categories &&
            categories.map(category =>
              <CategoryRightSide
                key={category.id}
                category={category}
                activeCategory={activeCategory}
                showQuestions={showQuestions}
                removeStoreCategory={removeStoreCategory}
                addStoreCategory={addStoreCategory}
                dragDropElement={dragDropElement}
                setCategories={setCategories}
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
              selectAllQuestions={selectAllQuestions}
              checkedIdAllQuestions={checkedIdAllQuestions}
            />
            {questions.filter((item) => activeCategory.questions.includes(item.id))
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
