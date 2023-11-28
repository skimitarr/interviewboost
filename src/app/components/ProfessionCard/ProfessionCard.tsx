'use client'
import Link from 'next/link'
import { useTranslation } from "react-i18next"
import { useAppDispatch } from '../../hooks'
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { IProffesion } from '../Types'
import { colorBlack3 } from '@/css/variables';
import { StyledCard, StyledComingSoon, StyledTitle } from './style'

export function ProfessionCard({ profession }: { profession: IProffesion }) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  function handleClick() {
    dispatch({ type: 'actionType/getProfession', payload: profession }); //type и payload из-за саги, чтоб без бесконечного цикла
    dispatch({ type: 'actionType/getAllGrades' });
    dispatch({ type: 'actionType/getAllCategories' });
    dispatch({ type: 'actionType/getAllQuestions' });
    dispatch({ type: 'actionType/getAllAnswers' });
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
            onClick={() => handleClick()}
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
