import styled from '@mui/material/styles/styled';
import {
  MixinFlexCenter,
  сolorBtn,
  colorBlack3,
  colorMainGradient
} from '@/css/variables';

export const StyledCard = styled('div')(() => ({
  maxWidth: '440px',
  minHeight: '120px',
  padding: '25px 38px 14px',
  background: colorBlack3,
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',

  '&:hover': {
    background: colorMainGradient,
  }
}))

export const StyledTitle = styled('h2')(() => ({
  marginBottom: '14px',
  fontSize: '24px',
}))

export const StyledComingSoon = styled('div')(() => ({
  position: 'absolute',
  ...MixinFlexCenter,
  top: '0',
  right: '0',
  width: '125px',
  height: '30px',
  background: сolorBtn,
  borderRadius: '0px 5px',
}))

