'use client'
import { useState, useEffect, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from '../../hooks'
import { useSelector } from 'react-redux';
import applySpec from 'ramda/es/applySpec';
import fastDeepEqual from 'fast-deep-equal';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { getCurrentIdQuestion } from '../../store/slices/app-data.slice'
import { selectFromAppData } from '@/app/store/selectors/data';
import { StoreState } from '@/app/store/types';
import { StyledInput, StyledInputClear } from "./style";
import {
  DataReport,
  ICategory,
  IProffesion,
  IQuestion
} from '../Types';

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
    getCurrentReport && getCurrentReport(report, id);
    clearSearch();
  }

  return (
    <Box sx={{ padding: '0 27px' }}>
      <Typography
        sx={{
          margin: '25px 0 18px 0',
          textAlign: 'center',
          fontSize: '18px',
        }}
      >
        {pageName !== 'reports'
          ? `${t('questionsFor')} ${storeProfession?.title}`
          : t('reportsHistory')}
      </Typography>
      <Box sx={{ position: 'relative' }}>
        <StyledInput
          type="text"
          value={searchText}
          onChange={searchInQuestion}
          showIcon={!searchText}
        />
        {searchText && <StyledInputClear onClick={clearSearch}></StyledInputClear>}
      </Box>

      {searchResult.length > 0 &&
        <Box
          sx={({ custom }) => ({
            margin: '-11px 0 16px 0',
            padding: '15px 20px 5px 20px',
            borderRadius: '5px',
            backgroundColor: custom.colorTwilightSlate,
          })}>
          {searchResult.map(question => {
            const parts = question.text.split(new RegExp(`(${searchText})`, 'gi')); //разбиваем текст чтобы выделить searchText
            return (
              <Typography
                key={question.id}
                onClick={() => getIdQuestion(question.id)}
                sx={{ marginBottom: '10px', cursor: 'pointer' }}
              >
                {parts.map((part, index) =>
                  part.toLowerCase() === searchText.toLowerCase()
                    ? <Typography
                      key={index}
                      component="span"
                      sx={({ custom }) => ({ color: custom.colorAzureBlue })}
                    >
                      {part}
                    </Typography>
                    : <Typography key={index} component="span">{part}</Typography>
                )}
              </Typography>
            );
          })}
        </Box>
      }

      {searchResultReports.length > 0 &&
        <Box
          sx={({ custom }) => ({
            margin: '-11px 0 16px 0',
            padding: '15px 20px 5px 20px',
            borderRadius: '5px',
            backgroundColor: custom.colorTwilightSlate,
          })}>
          {searchResultReports.map(report => {
            const parts = report.name.split(new RegExp(`(${searchText})`, 'gi')); //разбиваем текст чтобы выделить searchText
            const reportWithoutId = { ...report }; // Создаем копию объекта report без поля id, чтобы онo не отрисовывалась
            delete reportWithoutId.id;
            return (
              <Typography
                key={report.id}
                onClick={() => getReport(reportWithoutId, report.id as string)}
                sx={{ marginBottom: '10px', cursor: 'pointer' }}
              >
                {parts.map((part, index) =>
                  part.toLowerCase() === searchText.toLowerCase()
                    ? <Typography
                      key={index}
                      component="span"
                      sx={({ custom }) => ({ color: custom.colorAzureBlue })}
                    >
                      {part}
                    </Typography>
                    : <Typography key={index} component="span">{part}</Typography>
                )}
              </Typography>
            );
          })}
        </Box>
      }
    </Box>
  )
}
