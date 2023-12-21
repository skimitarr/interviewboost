import styled from '@mui/material/styles/styled';
import { MixinFlexCenter } from '@/styles/mixins';

export const StyledHeader = styled('header')(({  theme: { custom } }) => ({
  ...MixinFlexCenter,
  justifyContent: 'space-between',
  height: '80px',
  background: custom.colorGraphiteGray,
}))

export const StyledLinkNavigation = styled('a')<{isPathname: boolean}>(({isPathname, theme: { custom }}) => ({
  position: 'relative',
  display: 'flex',
  height: '80px',
  padding: '0 6px',
  fontSize: '16px',
  background: isPathname ? custom.colorMainGradient : 'none',
  '&:not(:last-child)': {
    marginRight: '38px',
  },

  '&::before': { // потому что transition не работает с градиентами для hover
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isPathname ? 'none' : custom.colorMainGradient,
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },
  '&:hover::before': {
    opacity: 1,
  },

  '& > p': {
    transition: 'color 0.3s ease-in-out',
  },
  '&:hover > p': {
    color: isPathname ? 'inherit' : custom.colorLustrousAzureBlue,
  },
}))

export const StyledLinkSignOut = styled('a')(({  theme: { custom } }) => ({
  position: 'absolute',
  ...MixinFlexCenter,
  top: '50px',
  right: '0',
  width: '100px',
  height: '30px',
  borderRadius: '5px',
  backgroundColor: custom.colorShadowCharcoal,
  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
  cursor: 'pointer',
  zIndex: '1',
}))

export const StyledLinkSignIn = styled('a')(({  theme: { custom } }) => ({
  ...MixinFlexCenter,
  width: '125px',
  height: '30px',
  borderRadius: '5px',
  background: custom.colorAzureBlue,
}))
