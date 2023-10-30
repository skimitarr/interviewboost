'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from '../hooks'
import Link from "next/link"
import { useTranslation } from "react-i18next";
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import fastDeepEqual from 'fast-deep-equal';

import { addCategory, removeCategory } from '../store/slices/app-data.slice';
import { IGrade, ICategory, IQuestion, IProffesion } from "../components/Types";
import { selectFromAppData } from '@/app/store/selectors/data';
import applySpec from 'ramda/es/applySpec';
import { useSelector } from "react-redux";
import { StoreState } from "@/app/store/types";

type Selector = {
  storeProfession: IProffesion | null,
  storeGrades: IGrade[],
  storeAllCategories: ICategory[],
  storeCategories: ICategory[],
  storeQuestions: IQuestion[],
};

const selector = applySpec<Selector>({
  storeProfession: selectFromAppData('profession', null),
  storeGrades: selectFromAppData('grades', []),
  storeAllCategories: selectFromAppData('allCategories', []),
  storeCategories: selectFromAppData('categories', []),
  storeQuestions: selectFromAppData('questions', []),
});

export default function PageForm__rightSide() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch()

  const {
    storeProfession,
    storeGrades,
    storeAllCategories,
    storeCategories,
    storeQuestions
  } = useSelector<StoreState, Selector>(selector, fastDeepEqual);

  const [grades, setGrades] = useState<IGrade[]>([]); // массив (junior middle) с базы данных
  const [activeGradeName, setActiveGradeName] = useState<string>('Junior'); // определяем активую кнопку (junior middle) для стилизации
  const [categories, setCategories] = useState<ICategory[]>([]); // массив (html css) с базы данных
  const [categoriesForStore, setCategoriesForStore] = useState<ICategory[]>([]); // тут убираем/добавляем вопросы
  const [activeCategoriesName, setActiveCategoriesName] = useState<string[]>([]); // определяем активные(раскрытые) категории (html css)
  const [questions, setQuestions] = useState<IQuestion[]>([]); // массив всех вопросов с базы данных
  const [checkedIdQuestions, setCheckedIdQuestions] = useState<string[]>([]); // массив id вопросов которые checked
  const [checkedStates, setCheckedStates] = useState<{ [key: string]: boolean }>({});

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

  const selectQuestions = (questionId: string, questionCategory: ICategory) => { // добавляем/убираем вопросы
    if (checkedIdQuestions.includes(questionId)) { //если вопрос неактивный, активируем его
      let result = checkedIdQuestions.filter(item => item !== questionId)
      setCheckedIdQuestions(result)
    } else {
      setCheckedIdQuestions(prev => [...prev, questionId]) //и наоборот
    }

    // обновляем categoriesForStore для передачи в Store
    const currentCategoriesForStore = categoriesForStore.find(item => item.id === questionCategory.id); // нужная категория в categoriesForStore
    if (currentCategoriesForStore) {
      let updatedQuestions: string[] = []
      if (currentCategoriesForStore.questions.includes(questionId)) {
        updatedQuestions = currentCategoriesForStore.questions.filter((item) => item !== questionId);
      } else {
        updatedQuestions = currentCategoriesForStore.questions.concat(questionId);
        updatedQuestions = updatedQuestions.sort((a: any, b: any) => a - b)
      }

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

  useEffect(() => { // делаем все checkedStates изначально true
    const initialCheckedStates: { [key: string]: boolean } = {};
    categories.forEach(category => {
      initialCheckedStates[category.id] = true;
    });
    setCheckedStates(initialCheckedStates);
  }, [categories]);

  const selectAllQuestions = (questionCategory: ICategory, itemId: string) => { // добавляем/убираем все вопросы
    let currentCategoriesForStore = storeAllCategories.find(item => item.id === questionCategory.id); // нужная категория
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
          {categories && categories.map(category => {
            return (
              <div key={category.id} className="questions__technology">
                <div className='questions__technology-wrapper1'>

                  <div className='questions__technology-wrapper2'>
                    <button
                      className={`questions__technology-name ${activeCategoriesName.includes(category.title) ? 'active' : ''} ${storeCategories.find(item => item.id === category.id) ? 'isChoosen' : ''} `}
                      onClick={() => showQuestions(category.title)}
                    >
                      {category.title}
                    </button>
                    <p className="questions__technology-name-shadow"></p>
                  </div>

                  {storeCategories.find(item => item.id === category.id)
                    ? <button className='questions__technology-btn questions__technology btn' onClick={() => removeStoreCategory(category)}>{t('cancel')}</button>
                    : <button className='questions__technology-btn isChoosen btn' onClick={() => addStoreCategory(category)}>{t('add')}</button>}
                </div>

                {activeCategoriesName.includes(category.title) ? (
                  <>
                    <div className='questions__technology-questions-wrapper'>
                      <input id={category.id} type="checkbox" className="checkbox"
                        onChange={() => selectAllQuestions(category, category.id)}
                        checked={checkedStates[category.id] || false} />
                      <label htmlFor={category.id} className='questions__technology-questions'>{t('selectAll')}</label>
                    </div>
                    <DragDropContext onDragEnd={(result) => handleDragEnd(result, category)}>
                      <Droppable droppableId="questions">
                        {(provided) => (
                          <div ref={provided.innerRef} >
                            {questions.filter((item) => category.questions.includes(item.id))
                              .map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                  {(provided) => (
                                    <div className='questions__technology-questions-wrapper'
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <input id={`question-${item.id}`} className="checkbox" type="checkbox" onChange={() => selectQuestions(item.id, category)}
                                        checked={checkedIdQuestions.includes(item.id)} />
                                      <label htmlFor={`question-${item.id}`}
                                        className={`questions__technology-questions ${checkedIdQuestions.includes(item.id) ? '' : 'isSelected'}`}
                                      >{index + 1}. {item.text}
                                      </label>

                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </>
                ) : null}
              </div>)
          })}
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
