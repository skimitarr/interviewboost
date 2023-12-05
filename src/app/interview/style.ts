import styled from '@mui/material/styles/styled';
import { MixinFlexCenter } from '@/css/variables';

export const StyledLeftContainer= styled('div')(({ theme: { custom } }) => ({
  height: 'calc(100vh - 160px)',
  paddingBottom: '20px',
  overflowY: 'auto',
  scrollbarWidth: 'thin',          /* "auto" или "thin" */
  scrollbarColor: `${custom.colorAzureBlue} transparent`,   /* цвет бегунка и зоны отслеживания */

  '&::-webkit-scrollbar': {
    width: '4px',               /* ширина всей полосы прокрутки */
    '&-thumb': {
      backgroundColor: custom.colorAzureBlue,    /* цвет бегунка */
      borderRadius: '10px',       /* округлось бегунка */
      height: '300px',
    }
  }
}))

export const StyledBtnWrapper = styled('div')(({ theme: { custom } }) => ({
  position: 'fixed',
  ...MixinFlexCenter,
  width: 'calc(100% * 1 / 3)',
  height: '80px',
  bottom: '0',
  padding: '0 25px',
  backgroundColor: custom.colorGraphiteGray,
  borderTop: `1px solid ${custom.colorSnowWhite}`,
}));

export const StyledRightContainer= styled('div')(({ theme: { custom } }) => ({
  height: 'calc(100vh - 280px)',
  backgroundColor: custom.colorShadowCharcoal,
  overflowY: 'auto',
  scrollbarWidth: 'thin',          /* "auto" или "thin" */
  scrollbarColor: `${custom.colorAzureBlue} transparent`,   /* цвет бегунка и зоны отслеживания */

  '&::-webkit-scrollbar': {
    width: '4px',               /* ширина всей полосы прокрутки */
    '&-thumb': {
      backgroundColor: custom.colorAzureBlue,    /* цвет бегунка */
      borderRadius: '10px',       /* округлось бегунка */
      height: '300px',
    }
  }
}))

export const StyledForm = styled('form')(({ theme: { custom } }) => ({
  position: 'fixed',
  width: 'calc(100% *2 / 3)',
  height: '220px',
  bottom: '0',
  right: '0',
  padding: '0 10px',
  backgroundColor: custom.colorGraphiteGray,
}))

export const StyledRadioLabel= styled('label')<{mark: string, isChecked: boolean}>(({mark, isChecked, theme: { custom }}) => ({
  width: '100%',
  height: '30px',
  padding: '2px 0',
  margin: '10px 0',
  textAlign: 'center',
  borderRadius: '5px',
  border: `1px solid ${custom.colorSnowWhite}`,
  backgroundColor: custom.colorShadowCharcoal,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor:
      +mark <= 55 ? custom.colorCoralBlush :
      (+mark >= 60 && +mark <= 65 ? custom.colorAmberGlow :
      (+mark >= 70 && +mark <= 75 ? custom.colorHoneydewGold :
      (+mark >= 80 && +mark <= 85 ? custom.colorSapphireSky :
      (+mark >= 90 && +mark <= 100 ? custom.colorJadeTeal : 'none')))),
    height: '40px',
    margin: '0',
    padding: '10px 0',
    border: 'none',
  },
  ...(isChecked
    ?  {
      backgroundColor:
        +mark <= 55 ? custom.colorCoralBlush :
        (+mark >= 60 && +mark <= 65 ? custom.colorAmberGlow :
        (+mark >= 70 && +mark <= 75 ? custom.colorHoneydewGold :
        (+mark >= 80 && +mark <= 85 ? custom.colorSapphireSky :
        (+mark >= 90 && +mark <= 100 ? custom.colorJadeTeal : 'none')))),
      height: '40px',
      margin: '0',
      padding: '10px 0',
      border: 'none',
    }
  : {})
}))

export const StyledTextareaLabel= styled('div')(({ theme: { custom } }) => ({
  position: 'absolute',
  bottom: '53px',
  left: '22px',
  padding: '7px 20px',
  borderRadius: '10px',
  backgroundColor: custom.colorGraphiteGray,
  fontSize: '14px',
  letterSpacing: '0.5px',
  lineHeight: '1.5',
}))

export const StyledTextarea= styled('textarea')(({ theme: { custom } }) => ({
  width: '100%',
  height: '60px',
  padding: '17px 25px',
  outline: 'none',
  border: 'none',
  borderRadius: '10px',
  backgroundColor: custom.colorTwilightSlate,
  resize: 'none',
  '&::placeholder': {
    color: custom.colorSnowWhite,
  }
}))

export const StyledModalWindow= styled('div')(() => ({
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
}))

export const StyledModalWindowContainer= styled('div')(({ theme: { custom } }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  width: '450px',
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '40px 20px 30px 20px',
  background: custom.colorShadowCharcoal,
  transform: 'translate(-50%, -50%)',
}))

export const StyledModalWindowClear = styled('div')(() => ({
  position: 'absolute',
  top: '20px',
  right: '18px',
  width: '14px',
  height: '14px',
  backgroundImage: `url('../../../ClearSearch.svg')`,
  cursor: 'pointer',
}))

export const StyledModalWindowInput = styled('input')(({ theme: { custom } }) => ({
  width: '100%',
  height: '60px',
  padding: '21px 25px',
  outline: 'none',
  border: 'none',
  borderRadius: '10px',
  backgroundColor: custom.colorTwilightSlate,
  '&::placeholder': {
    color: custom.colorSnowWhite,
  }
}))

export const StyledModalWindowLoading = styled('div')(() => ({
  position: 'absolute',
  ...MixinFlexCenter,
  flexDirection: 'column',
  justifyContent: 'space-around',
  width: '100%',
  height: '100%',
  top: '0',
  left: '0',
  backgroundColor: 'rgba(65, 67, 80, 1)', /* Задаем прозрачный фон */
  zIndex: '2',
}))

export const StyledModalWindowLoader = styled('div')(({ theme: { custom } }) => ({
    width: '400px',
    height: '20px',
    backgroundColor: custom.colorTwilightSlate,
    position: 'relative',
    overflow: 'hidden',

  '&::after': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '-400px', /* Начальная позиция за пределами видимой области */
    width: '400px',
    height: '20px',
    background: `linear-gradient(90deg, rgba(85, 124, 252, 0.00) 0%, #557CFC 100%)`,
    animation: 'moveRight 2s linear infinite',
  },

  '@keyframes moveRight': {
    to: {
      left: '100%', /* Конечная позиция справа */
    }
  },
}))
