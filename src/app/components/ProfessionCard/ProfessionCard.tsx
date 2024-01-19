'use client'
import { useTranslation } from "react-i18next"
import { useAppDispatch } from '../../hooks'
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { IProffesion } from '../Types'
import { StyledCard, StyledComingSoon, StyledTitle } from './style'

export function ProfessionCard({ profession }: { profession: IProffesion }) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();

  function handleClick() {
    dispatch({ type: 'actionType/getProfession', payload: profession }); //type и payload из-за саги, чтоб без бесконечного цикла
    dispatch({ type: 'actionType/getAllGrades' });
    dispatch({ type: 'actionType/getAllCategories' });
    dispatch({ type: 'actionType/getAllQuestions' });
    dispatch({ type: 'actionType/getAllAnswers' });
    router.push('/questions');
  }

  return (
    <>
      {profession.id === '1'
        ?
        <StyledCard onClick={() => handleClick()}>
          <StyledTitle>{profession.title}</StyledTitle>
          <Typography>{profession.desc}</Typography>
        </StyledCard>
        :
        <Box
          sx={{
            position: 'relative',
            maxWidth: '440px',
            minHeight: '120px',
          }}>
          <Box
            sx={({ custom }) => ({
              padding: '25px 38px 14px',
              background: custom.colorTwilightSlate,
              borderRadius: '5px',
              opacity: '0.3',
            })}>
            <StyledTitle>{profession.title}</StyledTitle>
            <Typography>{profession.desc}</Typography>
          </Box>
          <StyledComingSoon>{t('comingSoon')}</StyledComingSoon>
        </Box>}
    </>
  )
}
