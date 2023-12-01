import styled from '@mui/material/styles/styled';
import {
  colorBlack2,
  colorBlack3,
  сolorBtn,
  colorMainGradient,
} from '@/css/variables';

export const StyledRightSide = styled('div')(() => ({
  position: 'relative',
  height: 'calc(100vh - 80px)',
  padding: '0 5px 0 0',
  backgroundColor: colorBlack3,
  overflowY: 'auto',
  scrollbarWidth: 'thin',          /* "auto" или "thin" */
  scrollbarColor: `${сolorBtn} transparent`,   /* цвет бегунка и зоны отслеживания */

  '&::-webkit-scrollbar': {
    width: '4px',               /* ширина всей полосы прокрутки */
    '&-thumb': {
      backgroundColor: сolorBtn,    /* цвет бегунка */
      bordeRadius: '10px',       /* округлось бегунка */
      height: '300px',
    },
  },
}))

export const StyledCategories = styled('div')(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  height: '220px',
  padding: '10px 10px 0 10px',
  backgroundColor: colorBlack2,
  overflowY: 'auto',
  scrollbarWidth: 'thin',          /* "auto" или "thin" */
  scrollbarColor: `${сolorBtn} transparent`,   /* цвет бегунка и зоны отслеживания */

  '&::-webkit-scrollbar': {
    width: '4px',               /* ширина всей полосы прокрутки */
    '&-thumb': {
      backgroundColor: сolorBtn,    /* цвет бегунка */
      bordeRadius: '10px',       /* округлось бегунка */
    },
  },
}))

export const StyledLink = styled('a')(() => ({
  textAlign: 'center',
  minWidth: '585px',
  height: '30px',
  borderRadius: '5px',
  background: colorMainGradient,
}))
