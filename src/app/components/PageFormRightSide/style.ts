import styled from '@mui/material/styles/styled';

export const StyledRightSide = styled('div')(({  theme: { custom } }) => ({
  position: 'relative',
  height: 'calc(100vh - 80px)',
  padding: '0 5px 0 0',
  backgroundColor: custom.colorTwilightSlate,
  overflowY: 'auto',
  scrollbarWidth: 'thin',          /* "auto" или "thin" */
  scrollbarColor: `${custom.colorAzureBlue} transparent`,   /* цвет бегунка и зоны отслеживания */

  '&::-webkit-scrollbar': {
    width: '4px',               /* ширина всей полосы прокрутки */
    '&-thumb': {
      backgroundColor: custom.colorAzureBlue,    /* цвет бегунка */
      bordeRadius: '10px',       /* округлось бегунка */
      height: '300px',
    },
  },
}))

export const StyledCategories = styled('div')(({  theme: { custom } }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  height: '220px',
  padding: '10px 10px 0 10px',
  backgroundColor: custom.colorGraphiteGray,
  overflowY: 'auto',
  scrollbarWidth: 'thin',          /* "auto" или "thin" */
  scrollbarColor: `${custom.colorAzureBlue} transparent`,   /* цвет бегунка и зоны отслеживания */

  '&::-webkit-scrollbar': {
    width: '4px',               /* ширина всей полосы прокрутки */
    '&-thumb': {
      backgroundColor: custom.colorAzureBlue,    /* цвет бегунка */
      bordeRadius: '10px',       /* округлось бегунка */
    },
  },
}))

export const StyledLink = styled('a')(({ theme: { custom } }) => ({
  textAlign: 'center',
  minWidth: '585px',
  height: '30px',
  borderRadius: '5px',
  background: custom.colorMainGradient,
}))
