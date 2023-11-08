'use client'
import { useState, useEffect, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from '../hooks'

import { DataReport, ICategory, IProffesion, IQuestion } from './Types';
import { getCurrentIdQuestion } from '../store/slices/app-data.slice'
import classnames from "classnames";

import { selectFromAppData } from '@/app/store/selectors/data';
import applySpec from 'ramda/es/applySpec';
import { useSelector } from 'react-redux';
import { StoreState } from '@/app/store/types';
import fastDeepEqual from 'fast-deep-equal';

type Selector = {
  storeProfession: IProffesion | null,
  storeCategories: ICategory[],
  storeQuestions: IQuestion[],
};

const selector = applySpec<Selector>({
  storeProfession: selectFromAppData('profession', null),
  storeCategories: selectFromAppData('categories', []),
  storeQuestions: selectFromAppData('questions', []),
});

type Props = {
  getCurrentReport?: (item: DataReport, id: string) => void;
  pageName?: string
}

export function Search({ pageName, getCurrentReport }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch()

  const {
    storeProfession,
    storeCategories,
    storeQuestions
  } = useSelector<StoreState, Selector>(selector, fastDeepEqual);

  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState<IQuestion[]>([]);
  const [searchResultReports, setSearchResultReports] = useState<DataReport[]>([]);

  useEffect(() => {
    if (searchText && pageName !== 'reports') {
      const set = new Set(); // фильтрация - получаем все вопросы из левой части и в них проводим поиск
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
        <input type="text" value={searchText} onChange={searchInQuestion}
          className={classnames('search__input', { 'hasPlaceholder': !searchText })}
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
