'use client'
import Link from 'next/link'
import { useTranslation } from "react-i18next"
import { useAppDispatch } from '../hooks'
import { getDbAllGrades, getDbAllCategories, getDbAllQuestions, getDbAllAnswers } from '../../services/DatabaseService'

import { ICategory, IProffesion, IQuestion } from '../components/Types'
import { getProfession, getGrades, getAllCategories, getQuestions, getAnswers } from '../store/DataSlice';

export function ProfessionCard({ profession }: { profession: IProffesion }) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const fetchGrades = async () => {
    try {
      const gradesData = await getDbAllGrades();
      dispatch(getGrades(gradesData));
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      let categoriesData = await getDbAllCategories();
      categoriesData = categoriesData.sort((a: ICategory, b: ICategory) => +a.id - +b.id)
      dispatch(getAllCategories(categoriesData));
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

  const fetchQuestions = async () => { // TODO: пересмотреть работу с БД
    try {
      let questionsData = await getDbAllQuestions();
      questionsData = questionsData.sort((a: IQuestion, b: IQuestion) => +a.id - +b.id)
      dispatch(getQuestions(questionsData));
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

  const fetchAnswers = async () => {
    try {
      const answersData = await getDbAllAnswers();
      dispatch(getAnswers(answersData));
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

  function handleClick(profession: IProffesion) {
    dispatch(getProfession(profession));
    fetchGrades();
    fetchCategories();
    fetchQuestions();
    fetchAnswers();
  }

  return (
    <>
      {profession.id === '1'
        ? <Link href={{
          pathname: '/questions',
          query: { ProfeesionId: profession.id },
        }}
          onClick={() => handleClick(profession)} className='card' >
          <p className='card__title'>{profession.title}</p>
          <p className='card__desc'>{profession.desc}</p>
        </Link>
        : <div className='card__notAcive'>
          <div className='card__notAcive-wrapper'>
            <p className='card__title'>{profession.title}</p>
            <p className='card__desc'>{profession.desc}</p>
          </div>
          <p className='card__notAcive-text'><span>{t('comingSoon')}</span></p>
        </div>}
    </>
  )
}
