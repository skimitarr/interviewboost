import styled from '@mui/material/styles/styled';
import { MixinFlexCenter } from '@/styles/mixins';

export const StyledHeader = styled('header')(({  theme: { custom } }) => ({
  ...MixinFlexCenter,
  justifyContent: 'space-between',
  height: '80px',
  background: custom.colorGraphiteGray,
}))

export const StyledLinkNavigation = styled('a')<{isPathname: boolean}>(({isPathname, theme: { custom }}) => ({
  display: 'flex',
  height: '80px',
  padding: '0 6px',
  fontSize: '16px',
  background: isPathname ? custom.colorMainGradient : 'none',
  '&:not(:last-child)': {
    marginRight: '38px',
  }
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
