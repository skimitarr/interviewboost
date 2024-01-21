import styled from '@mui/material/styles/styled';
import { MixinFlexCenter } from '@/styles/mixins';

export const StyledBtn = styled('div')<{isActive: boolean}>(({ isActive, theme: { custom } }) => ({
  ...MixinFlexCenter,
  justifyContent: 'flex-start',
  position: 'relative',
  width: '70px',
  height: '30px',
  borderRadius: '4px',
  border: `1px solid ${custom.colorShadowCharcoal}`,

  '&::before': {
    content: '""',
    position: 'absolute',
    right: '5px',
    top: '11px',
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderBottom: `6px solid ${custom.colorSnowWhite}`,
  },
  ...(isActive
    ? {
      '&::before': {
          borderLeft: '0',
          borderRight: '0',
          borderTop: '0',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          right: '5px',
          top: '11px',
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: `6px solid ${custom.colorSnowWhite}}`,
        },
      }
    : {}),
}))

export const StyledImg = styled('img')(() => ({
  width: '16px',
  height: '16px',
  marginRight: '5px',
  marginLeft: '10px'
}))

export const StyledList = styled('div')(({ theme: { custom } }) => ({
  position: 'absolute',
  right: '0',
  top: '35px',
  width: '70px',
  display: 'flex',
  flexDirection: 'column',
  zIndex: '100',
  backgroundColor: custom.colorShadowCharcoal,
}))

