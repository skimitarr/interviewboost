'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from '../hooks'
import Link from "next/link"
import { useTranslation } from "react-i18next";
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';

import { addCategory, removeCategory } from '../store/DataSlice';
import { IGrade, ICategory, IQuestion } from "../components/Types";

export default function PageForm__rightSide() {
  const [grades, setGrades] = useState<IGrade[]>([]); // массив (junior middle) с базы данных
  const [activeGradeName, setActiveGradeName] = useState<string>('Junior'); // определяем активую кнопку (junior middle) для стилизации
  const [categories, setCategories] = useState<ICategory[]>([]); // массив (html css) с базы данных
  const [categoriesForStore, setCategoriesForStore] = useState<ICategory[]>([]); // тут убираем/добавляем вопросы
  const [activeCategoriesName, setActiveCategoriesName] = useState<string[]>([]); // определяем активные(раскрытые) категории (html css)
  const [questions, setQuestions] = useState<IQuestion[]>([]); // массив всех вопросов с базы данных
  const [checkedIdQuestions, setCheckedIdQuestions] = useState<string[]>([]); // массив id вопросов которые checked
  const [checkedStates, setCheckedStates] = useState<{ [key: string]: boolean }>({});
  // const [currentDragQuestion, setCurrentDragQuestion] = useState<IQuestion>({ id: '', text: '', answers: [] });

  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch()
  const storeProfession = useAppSelector((state) => state.profession)
  const storeGrades = useAppSelector((state) => state.grades)
  const storeAllCategories = useAppSelector((state) => state.allCategories)
  const storeCategories = useAppSelector((state) => state.categories)
  const storeQuestions = useAppSelector((state) => state.questions)

  useEffect(() => { // получаем grades
    if (storeGrades) {
      setGrades(storeGrades);
    }
  }, [storeGrades])

  useEffect(() => { // получаем categories
    if (grades.length > 0) {
      const filteredGrade = grades.find(grade => grade.title === activeGradeName);
      let categoriesData = storeAllCategories.filter((item) => {
        return filteredGrade?.categories.includes(item.id);
      })
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

      const questionsData = storeQuestions.filter((item) => {
        return arrayOfIds.includes(item.id);
      })
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

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setQuestions(items);

    addStoreCategory(category)
  };

  return (
    storeProfession
      ? <div className='questions__rightSide'>
        {/* <div className='questions__chooseGrade'>
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
              <div key={category.id} className={`questions__technology ${activeCategoriesName.length > 0 ? 'active' : ''}`}>
                <div className='questions__technology-wrapper1'>


                  {storeCategories.find(item => item.id === category.id) ?
                    <div className='questions__technology-wrapper2'>
                      <button
                        className={`questions__technology-name ${activeCategoriesName.includes(category.title) ? 'active' : ''} isChoosen`}
                        onClick={() => showQuestions(category.title)}
                      >
                        {category.title}
                      </button>
                      <p className="questions__technology-name-shadow"></p>
                    </div>

                    : <div className='questions__technology-wrapper2'>
                      <button
                        className={`questions__technology-name ${activeCategoriesName.includes(category.title) ? 'active' : ''}`}
                        onClick={() => showQuestions(category.title)}
                      >
                        {category.title}
                      </button>
                      <p className="questions__technology-name-shadow"></p>
                    </div>}

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
                            {questions
                              .filter((item) => {
                                return category.questions.some((el) => {
                                  return item.id === el;
                                });
                              })
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
                                      >{index + 1}. {item.text}</label>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
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
