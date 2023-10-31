'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from '../hooks'
import Link from "next/link"
import { useTranslation } from "react-i18next";

import { addCategory, removeCategory } from '../store/DataSlice';
import { IGrade, ICategory, IQuestion } from "./Types";
import Category__rightSide from "./Category__rightSide";
import { createInstance } from "i18next";
// import InputQuestion from "./InputQuestion";

export default function PageForm__rightSide() {
  const [grades, setGrades] = useState<IGrade[]>([]); // массив (junior middle) с базы данных
  const [activeGradeName, setActiveGradeName] = useState<string>('Junior'); // определяем активую кнопку (junior middle) для стилизации
  const [categories, setCategories] = useState<ICategory[]>([]); // массив (html css) с базы данных
  const [categoriesForStore, setCategoriesForStore] = useState<ICategory[]>([]); // тут убираем/добавляем вопросы
  const [activeCategoriesName, setActiveCategoriesName] = useState<string[]>([]); // определяем активные(раскрытые) категории (html css)
  const [questions, setQuestions] = useState<IQuestion[]>([]); // массив всех вопросов с базы данных
  const [checkedIdQuestions, setCheckedIdQuestions] = useState<string[]>([]); // массив id вопросов которые checked
  const [checkedStates, setCheckedStates] = useState<{ [key: string]: boolean }>({}); //чекобоксы выбрать все

  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch()
  const storeProfession = useAppSelector((state) => state.profession)
  const storeGrades = useAppSelector((state) => state.grades)
  const storeAllCategories = useAppSelector((state) => state.allCategories)
  const storeCategories = useAppSelector((state) => state.categories)
  const storeQuestions = useAppSelector((state) => state.questions)
  const сheckedIdQuestionDragDrop = useAppSelector((state) => state.checkedQuestionDragDrop)

  useEffect(() => { // получаем grades
    if (storeGrades) {
      setGrades(storeGrades);
    }
  }, [storeGrades])

  useEffect(() => { // получаем categories
    if (grades.length > 0) {
      const filteredGrade = grades.find(grade => grade.title === activeGradeName);
      let categoriesData = storeAllCategories.filter((item) => filteredGrade?.categories.includes(item.id))
      categoriesData = categoriesData.sort((a: any, b: any) => a.id - b.id)
      setCategories(categoriesData);
      setCategoriesForStore(categoriesData);
    }
  }, [grades, activeGradeName])

  useEffect(() => { // получаем questions
    if (categories.length > 0) {
      let set = new Set();
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

  const showQuestions = (categoryTitle: string) => {
    if (activeCategoriesName.includes(categoryTitle)) { //если вопросы открыты, скрываем их
      let result = activeCategoriesName.filter(item => item !== categoryTitle)
      setActiveCategoriesName(result)
    } else {
      setActiveCategoriesName([...activeCategoriesName, categoryTitle]) //и наоборот
    }
  }

  const addStoreCategory = (category: ICategory) => {
    const currentCategoriesForStore = categoriesForStore.filter(item => item.id === category.id);
    dispatch(addCategory(currentCategoriesForStore[0]))
  }

  const removeStoreCategory = (category: ICategory) => {
    dispatch(removeCategory(category))
  }

  const saveQuestions = () => {
    localStorage.setItem('choosenCategories', JSON.stringify(storeCategories));
    router.push('/interview');
  }
  console.log(categoriesForStore)


  useEffect(() => { // делаем все checkedStates изначально true
    const initialCheckedStates: { [key: string]: boolean } = {};
    categories.forEach(category => {
      initialCheckedStates[category.id] = true;
    });
    setCheckedStates(initialCheckedStates);
  }, [categories]);

  useEffect(() => { // получаем id вопроса, который перетащили в левую часть и он станет checked
    setCheckedIdQuestions(prev => [...prev, сheckedIdQuestionDragDrop]);
    const currentCategoriesForStore = categoriesForStore.find(item => item.id === сheckedIdQuestionDragDrop);
    if (currentCategoriesForStore) {
      selectQuestions(сheckedIdQuestionDragDrop, currentCategoriesForStore);
    }
  }, [сheckedIdQuestionDragDrop])

  const selectQuestions = (questionId: string, questionCategory: ICategory) => { // добавляем/убираем вопросы
    if (checkedIdQuestions.includes(questionId)) { //если вопрос активный, деактивируем его
      let result = checkedIdQuestions.filter(item => item !== questionId);
      setCheckedIdQuestions(result);
      selectQuestionsLogic(questionCategory, result); // вводим result из-за асинхронщины
    } else {
      setCheckedIdQuestions(prev => [...prev, questionId]); //и наоборот
      selectQuestionsLogic(questionCategory, [...checkedIdQuestions, questionId].sort((a: any, b: any) => a - b));
    }
  }

  const selectQuestionsLogic = (questionCategory: ICategory, checkedIdQuestions: string[]) => {
    // обновляем categoriesForStore для передачи в Store

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

      if (storeCategories.length > 0) { // если есть категории в сторе
        const isCategory = storeCategories.find(item => item.id === questionCategory.id);
        if (isCategory) { // если есть искомая категория в сторе
          dispatch(addCategory(updatedCategory));
        }
      }
    }

    if (checkedIdQuestions.length === 0) { // чтобы не возникало ошибки при обращении к firestore
      return;
    }
  }

  const selectAllQuestions = (questionCategory: ICategory, itemId: string) => { // добавляем/убираем все вопросы
    let currentCategoriesForStore = categories.find(item => item.id === questionCategory.id); // нужная категория
    const restCategoriesForStore = categoriesForStore.filter(item => item.id !== questionCategory.id); // остальные категории

    setCheckedStates((prev) => {
      const updatedState = { ...prev, [itemId]: !prev[itemId] };
      if (currentCategoriesForStore) {
        if (updatedState[itemId]) {
          currentCategoriesForStore.questions.forEach(item => {
            if (!checkedIdQuestions.includes(item)) {
              setCheckedIdQuestions(prev => [...prev, item])
            }
          })
        } else {
          let copy = checkedIdQuestions
          currentCategoriesForStore.questions.forEach(item => {
            const index = copy.findIndex((i) => i === item);
            if (index !== -1) { // Если объект найден, удаляем его из массива
              copy.splice(index, 1);
            }
          })
          setCheckedIdQuestions(copy)
          const temp = JSON.parse(JSON.stringify(currentCategoriesForStore.questions)) //удаляем вопросы для передачи в стор
          temp.length = 0
          currentCategoriesForStore = { ...currentCategoriesForStore, questions: temp }
        }

        setCategoriesForStore([...restCategoriesForStore, currentCategoriesForStore]);
        if (storeCategories.length > 0) { // если есть категории в сторе
          const isCategory = storeCategories.find(item => item.id === questionCategory.id);
          if (isCategory) { // если есть искомая категория в сторе
            dispatch(addCategory(currentCategoriesForStore));
          }
        }
      }
      return updatedState;
    });

    if (checkedIdQuestions.length === 0) { // чтобы не возникало ошибки при обращении к firestore
      return;
    }
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
    storeProfession
      ? <div className='questions__rightSide'>
        {/* <div className='questions__chooseGrade'> //TODO: добавить кнопки джун мидл сеньйор
          {grades && grades.map(item => {
            return <button key={item.id}
              onClick={() => setActiveGradeName(item.title)}
              className={`questions__chooseGrade-btn ${activeGradeName === item.title ? 'active' : ''}`}>
              {item.title}
            </button>
          })}
        </div> */}

        <h2 className='questions__title'>{t('selectATechnologyStack')}</h2>

        <div className="questions">
          {categories && categories.map(category =>
            <Category__rightSide key={category.id}
              category={category}
              activeCategoriesName={activeCategoriesName}
              showQuestions={showQuestions}
              removeStoreCategory={removeStoreCategory}
              addStoreCategory={addStoreCategory}
              selectAllQuestions={selectAllQuestions}
              checkedStates={checkedStates}
              questions={questions.filter((item) => category.questions.includes(item.id))}
              selectQuestions={selectQuestions}
              checkedIdQuestions={checkedIdQuestions}
              dragDropElement={dragDropElement}
              setCategories={setCategories}
              setQuestions={setQuestions}
            />
          )}
        </div>

        <div className='questions__nextPage-wrapper right'>
          <button className='questions__nextPage-btn btn' onClick={saveQuestions}>{t('save')}</button>
        </div>

      </div>
      : <div className='questions__rightSide'>
        <div className='questions__noData'>
          <p className='questions__noData-desc'>{t('selectSpecialization')}</p>
          <Link className='questions__noData-btn btn' href='/'><p>{t('letsGetStarted')}</p></Link>
        </div>
      </div>
  )
}
