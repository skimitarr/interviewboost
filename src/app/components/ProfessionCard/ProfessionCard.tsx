'use client'
import Link from 'next/link'
import { useTranslation } from "react-i18next"
import { useAppDispatch } from '../../hooks'
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { getDbAllGrades, getDbAllCategories, getDbAllQuestions, getDbAllAnswers } from '@/services/DatabaseService'
import { ICategory, IProffesion, IQuestion } from '../Types'
import { getProfession, getGrades, getAllCategories, getQuestions, getAnswers } from '../../store/slices/app-data.slice';
import { colorBlack3 } from '@/css/variables';
import { StyledCard, StyledComingSoon, StyledTitle } from './style'

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
      const categoriesData = await getDbAllCategories();
      const filteredData = categoriesData.sort((a: ICategory, b: ICategory) => +a.id - +b.id)
      dispatch(getAllCategories(filteredData));
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

  const fetchQuestions = async () => { // TODO: пересмотреть работу с БД
    try {
      const questionsData = await getDbAllQuestions();
      const filteredData = questionsData.sort((a: IQuestion, b: IQuestion) => +a.id - +b.id)
      dispatch(getQuestions(filteredData));
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
        ?
        <StyledCard>
          <Link
            href={{
              pathname: '/questions',
              query: { ProfeesionId: profession.id },
            }}
            onClick={() => handleClick(profession)}
          >
            <StyledTitle>{profession.title}</StyledTitle>
            <Typography>{profession.desc}</Typography>
          </Link>
        </StyledCard>

        :
        <Box
          sx={{
            position: 'relative',
            maxWidth: '440px',
            minHeight: '120px',
          }}>
          <Box
            sx={{
              padding: '25px 38px 14px',
              background: colorBlack3,
              borderRadius: '5px',
              opacity: '0.3',
            }}>
            <StyledTitle>{profession.title}</StyledTitle>
            <Typography>{profession.desc}</Typography>
          </Box>
          <StyledComingSoon>{t('comingSoon')}</StyledComingSoon>
        </Box>}
    </>
  )
}
