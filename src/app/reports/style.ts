import styled from '@mui/material/styles/styled';
import { MixinFlexCenter, colorWhite, сolorBtn, colorBlack3, colorBlack1, colorBlack2, } from '@/css/variables';

export const StyledNameBtn = styled('div')<{$isActive: boolean}>(({$isActive}) => ({
  height: '20px',
  color: $isActive ? сolorBtn : colorWhite,
  backgroundColor: colorBlack3,
  textAlign: 'center',
  lineHeight: '1.1',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease-in-out',

  '&:hover': {
    backgroundColor: 'green',
  }
}))

export const StyledTitle = styled('div')(() => ({
  ...MixinFlexCenter,
  width: '100%',
  height: '40px',
  marginBottom: '15px',
  borderRadius: '10px',
  backgroundColor: colorBlack1,
}))

export const StyledTextConclusion = styled('span')(() => ({
  display: 'inline-block',
  '&:nth-child(1)': {
    width: '80%',
    marginLeft: '20px',
    fontSize: '16px',
  },
  '&:nth-child(2)': {
    width: '15%',
    textAlign: 'center',
    fontSize: '40px',
  }
}))

export const StyledRow = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: '40% 10% 50%',
  position: 'relative',

  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: '0',
    bottom: '0',
    width: '1px',
    backgroundColor: colorWhite,
  },
  '&::before': {
    left: '40%',
  },
  '&::after': {
    left: '50%',
  },

  '&.blackBorder1': {
    '&::before': {
      backgroundColor: 'black',
    },
  },
  '&.blackBorder2': {
    '&::after': {
      backgroundColor: 'black',
    }
  }
}))

export const StyledRowItem = styled('div')(() => ({
  marginBottom: '20px',
  textAlign: 'center'
}))

export const StyledBtnWrapper = styled('div')(() => ({
  position: 'fixed',
  ...MixinFlexCenter,
  width: 'calc(100% * 2 / 3)',
  height: '80px',
  bottom: '0',
  padding: '0 25px',
  backgroundColor: colorBlack2,
}));
