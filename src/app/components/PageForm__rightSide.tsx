'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from '../hooks'
import Link from "next/link"

// import { getDbGrades, getDbCategories, getDbQuestions } from '../../services/DatabaseService'
import { addCategory, getCategories, removeCategory } from '../store/DataSlice';
import { IGrade, ICategory, IQuestion } from "../components/Types";

export default function PageForm__rightSide() {
  const [grades, setGrades] = useState<IGrade[]>([]); // массив (junior middle) с базы данных
  const [activeGradeName, setActiveGradeName] = useState<string>('Junior'); // определяем активую кнопку (junior middle) для стилизации
  const [categories, setCategories] = useState<ICategory[]>([]); // массив (html css) с базы данных
  const [categoriesForStore, setCategoriesForStore] = useState<ICategory[]>([]); // тут убираем/добавляем вопросы
  const [activeCategoriesName, setActiveCategoriesName] = useState<string[]>([]); // определяем активные(раскрытые) категории (html css)
  const [questions, setQuestions] = useState<IQuestion[]>([]); // массив всех вопросов с базы данных
  const [checkedIdQuestions, setCheckedIdQuestions] = useState<string[]>([]); // массив id вопросов которые checked

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
      // dispatch(getCategories([])) // в сторе убираем категории чтобы они сразу не добавлялись в левую часть
    }
  }, [grades, activeGradeName])

  useEffect(() => { // получаем questions
    if (categories.length > 0) {
      let set = new Set();
      categories.forEach(category => {
        category.questions.forEach(item => { set.add(item) })
      });
      const arrayOfIds = Array.from(set); // получаем все id вопросов со всех тем

      let questionsData = storeQuestions.filter((item) => {
        return arrayOfIds.includes(item.id);
      })
      setQuestions(questionsData);
    }
  }, [categories])

  // useEffect(() => { // получаем grades
  //   if (storeProfession) {
  //     const fetchGrades = async () => {
  //       try {
  //         // profession.grades - это список grades (их id) в profession в базе данных
  //         const gradesData = await getDbGrades(storeProfession.grades);
  //         setGrades(gradesData);
  //       } catch (error) {
  //         console.error('Error getting documents:', error);
  //       }
  //     };
  //     fetchGrades();
  //   }
  // }, [])

  // useEffect(() => { // получаем categories
  //   if (grades.length > 0) {
  //     const filteredGrade = grades.find(grade => grade.title === activeGradeName);
  //     const fetchCategories = async () => {
  //       try {
  //         // filteredGrade?.categories - это список categories (их id) в grades в базе данных
  //         let categoriesData = await getDbCategories(filteredGrade?.categories as string[]);
  //         categoriesData = categoriesData.sort((a: any, b: any) => a.id - b.id)
  //         setCategories(categoriesData);
  //         setCategoriesForStore(categoriesData);
  //       } catch (error) {
  //         console.error('Error getting documents:', error);
  //       }
  //     };
  //     fetchCategories();
  //   }
  // }, [grades, activeGradeName])

  // useEffect(() => { // получаем questions
  //   if (categories.length > 0) {
  //     let set = new Set();
  //     categories.forEach(category => {
  //       category.questions.forEach(item => { set.add(item) })
  //     });
  //     const arrayOfIds = Array.from(set); // получаем все id вопросов со всех тем

  //     const fetchQuestions = async () => {
  //       try {
  //         const questionsData = await getDbQuestions(arrayOfIds as string[]);
  //         setQuestions(questionsData);
  //       } catch (error) {
  //         console.error('Error getting documents:', error);
  //       }
  //     };
  //     fetchQuestions();
  //   }
  // }, [categories])

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

        <h2 className='questions__title'>Выберете стек технологий</h2>

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
                    ? <button className='questions__technology-btn questions__technology btn' onClick={() => removeStoreCategory(category)}>Отменить</button>
                    : <button className='questions__technology-btn isChoosen btn' onClick={() => addStoreCategory(category)}>Добавить</button>}
                </div>

                {activeCategoriesName.includes(category.title) ? (
                  <>
                    <div className='questions__technology-questions-wrapper'>
                      <input id={category.id} type="checkbox" className="checkbox" checked />
                      <label htmlFor={category.id}>Выбрать все</label>
                    </div>
                    {questions
                      .filter((item) => {
                        return category.questions.some((el) => {
                          return item.id === el;
                        });
                      })
                      .map((item, index) => (
                        <div key={item.id} className='questions__technology-questions-wrapper'>
                          <input id={item.id} className="checkbox" type="checkbox" onChange={() => selectQuestions(item.id, category)} checked={checkedIdQuestions.includes(item.id)} />
                          <label htmlFor={item.id} className={`questions__technology-questions ${checkedIdQuestions.includes(item.id) ? '' : 'isSelected'}`}>{index + 1}. {item.text}</label>
                        </div>
                      ))
                    }
                  </>
                ) : null}


              </div>)
          })}
        </div>

        <div className='questions__nextPage-wrapper'>
          <button className='questions__nextPage-btn btn' onClick={saveQuestions}>Сохранить</button>
        </div>

      </div>
      : <div className='questions__rightSide'>
        <div className='questions__noData'>
          <p className='questions__noData-desc'>Для начала Вам необходимо выбрать специализацию</p>
          <Link className='questions__noData-btn btn' href='/'><p>Начнем</p></Link>
        </div>
      </div>
  )
}
