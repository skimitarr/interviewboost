import styled from '@mui/material/styles/styled';
import { сolorBtn,
  colorMainGradient,
  colorBlack4,
  colorBlack2,
  MixinFlexCenter
} from '@/css/variables';

export const StyledHeader = styled('header')(() => ({
  ...MixinFlexCenter,
  justifyContent: 'space-between',
  height: '80px',
  background: colorBlack2,
}))

export const StyledLinkNavigation = styled('a')<{isPathname: boolean}>(({isPathname}) => ({
  display: 'flex',
  height: '80px',
  padding: '0 6px',
  fontSize: '16px',
  background: isPathname ? colorMainGradient : 'none',
  '&:not(:last-child)': {
    marginRight: '38px',
  }
}))

export const StyledLinkSignOut = styled('a')(() => ({
  position: 'absolute',
  ...MixinFlexCenter,
  top: '50px',
  right: '0',
  width: '100px',
  height: '30px',
  borderRadius: '5px',
  backgroundColor: colorBlack4,
  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
  cursor: 'pointer',
  zIndex: '1',
}))

export const StyledLinkSignIn = styled('a')(() => ({
  ...MixinFlexCenter,
  width: '125px',
  height: '30px',
  borderRadius: '5px',
  background: сolorBtn,
}))
