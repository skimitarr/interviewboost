'use client'
import { useState, useEffect, ChangeEvent } from "react";
import { useAppSelector, useAppDispatch } from '../hooks'

import { ICategory, IQuestion } from "./Types";
import { getCurrentIdQuestion } from '../store/DataSlice'

export default function Search() {
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState<IQuestion[]>([]);

  const dispatch = useAppDispatch()
  const storeProfession = useAppSelector((state) => state.profession)
  const storeCategories = useAppSelector((state) => state.categories)
  const storeQuestions = useAppSelector((state) => state.questions)

  useEffect(() => {
    if (searchText) {
      let set = new Set(); // фильтрация - получаем все вопросы из левой части и в них проводим поиск
      storeCategories.forEach((category: ICategory) => {
        category.questions.forEach(item => { set.add(item) })
      });
      const arrayOfIds = Array.from(set); // получаем все id вопросов со всех тем
      const questionsData = storeQuestions.filter((item) => {
        return arrayOfIds.includes(item.id);
      })

      questionsData.forEach((item: IQuestion) => {
        const checkQuestion = item.text.toLowerCase().includes(searchText.trim().toLowerCase());
        if (checkQuestion) {
          setSearchResult(prevArr => [...prevArr, item])
        }
      });
    }
  }, [searchText]);

  const searchInQuestion = (e: ChangeEvent<HTMLInputElement>) => { // при вводе в поиске показываются совпадающие вопросы (через useEffect)
    setSearchResult([])
    setSearchText(e.target.value);
  }

  const clearSearch = () => { // очищаем результаты поиска
    setSearchResult([])
    setSearchText('');
  }

  const getIdQuestion = (id: string) => { // передаем id вопроса в стор
    dispatch(getCurrentIdQuestion(id))
    clearSearch();
  }

  return (
    <div className="search" >
      <h2 className="search__title">Вопросы для {storeProfession?.title}</h2>
      <div className="search__wrapper">
        <input type="text"
          className={`search__input ${searchText ? '' : 'hasPlaceholder'}`}
          value={searchText}
          onChange={searchInQuestion}
        />
        {searchText && <div className="search__clear" onClick={clearSearch}></div>}
      </div>

      {searchResult.length > 0 && <div className="search__results">
        {searchResult.map(question => {
          const parts = question.text.split(new RegExp(`(${searchText})`, 'gi')); //разбиваем текст чтобы выделить searchText
          return (
            <p key={question.id} className="search__result" onClick={() => getIdQuestion(question.id)}>
              {parts.map((part, index) =>
                part.toLowerCase() === searchText.toLowerCase()
                  ? <span key={index} className="search__highlighted-text">{part}</span>
                  : <span key={index}>{part}</span>
              )}
            </p>
          );
        })}
      </div>}
    </div>
  )
}
