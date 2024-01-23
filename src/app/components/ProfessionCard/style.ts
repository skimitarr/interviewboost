import styled from '@mui/material/styles/styled';
import { MixinFlexCenter } from '@/styles/mixins';

export const StyledCard = styled('div')(({ theme: { custom }} ) => ({
  position: 'relative',
  maxWidth: '440px',
  minHeight: '120px',
  padding: '25px 38px 14px',
  background: custom.colorTwilightSlate,
  borderRadius: '5px',
  cursor: 'pointer',

  '&::before': { // потому что transition не работает с градиентами для hover
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: custom.colorMainGradient,
    opacity: 0,
    transition: 'opacity 0.5s ease-in-out',
  },
  '&:hover::before': {
    opacity: 1,
  },
}))

export const StyledTitle = styled('h2')(() => ({
  marginBottom: '14px',
  fontSize: '24px',
}))

export const StyledComingSoon = styled('div')(({ theme: { custom } }) => ({
  position: 'absolute',
  ...MixinFlexCenter,
  top: '0',
  right: '0',
  width: '125px',
  height: '30px',
  background: custom.colorAzureBlue,
  borderRadius: '0px 5px',
}))

