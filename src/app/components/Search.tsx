'use client'
import { useState, useEffect, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from '../hooks'

import { DataReport, ICategory, IQuestion, ISearchReport } from "./Types";
import { getCurrentIdQuestion } from '../store/slices/data.slice'

export default function Search({ pageName, getCurrentReport }: ISearchReport) {
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState<IQuestion[]>([]);
  const [searchResultReports, setSearchResultReports] = useState<DataReport[]>([]);

  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  const storeProfession = useAppSelector((state) => state.profession)
  const storeCategories = useAppSelector((state) => state.categories)
  const storeQuestions = useAppSelector((state) => state.questions)

  useEffect(() => {
    if (searchText && pageName !== 'reports') {
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

    if (searchText && pageName === 'reports') {
      const data = JSON.parse(localStorage.getItem('allDatas') || '[]');
      data.forEach((item: DataReport) => {
        const checkQuestion = item.name.toLowerCase().includes(searchText.trim().toLowerCase());
        if (checkQuestion) {
          setSearchResultReports(prevArr => [...prevArr, item])
        }
      });
    }
  }, [searchText]);

  const searchInQuestion = (e: ChangeEvent<HTMLInputElement>) => { // при вводе в поиске показываются совпадающие вопросы (через useEffect)
    setSearchResult([])
    setSearchText(e.target.value);
    setSearchResultReports([])
  }

  const clearSearch = () => { // очищаем результаты поиска
    setSearchResult([])
    setSearchResultReports([])
    setSearchText('');
  }

  const getIdQuestion = (id: string) => { // передаем id вопроса в стор
    dispatch(getCurrentIdQuestion(id))
    clearSearch();
  }

  const getReport = (report: DataReport, id: string) => {
    if (getCurrentReport) {
      getCurrentReport(report, id)
    }
    clearSearch();
  }

  return (
    <div className="search" >
      {pageName !== 'reports'
        ? <h2 className="search__title">{t('questionsFor')} {storeProfession?.title}</h2>
        : <h2 className="search__title">{t('reportsHistory')}</h2>}
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
          console.log(searchResult)
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

      {searchResultReports.length > 0 && <div className="search__results">
        {searchResultReports.map(report => {
          console.log(report)
          const parts = report.name.split(new RegExp(`(${searchText})`, 'gi')); //разбиваем текст чтобы выделить searchText
          const reportWithoutId = { ...report }; // Создаем копию объекта report без поля id, чтобы онo не отрисовывалась
          delete reportWithoutId.id;
          return (
            <p key={report.id} className="search__result" onClick={() => getReport(reportWithoutId, report.id as string)}>
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
