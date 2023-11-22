import styled from '@mui/material/styles/styled';
import { colorBlack3, colorMainGradient, colorWhite } from '@/css/variables';

type Props = {
  $isActive: boolean;
  $isDragging: boolean;
}

export const StyledLeftSide = styled('div')<Props>(({ $isActive, $isDragging }) => ({
  position: 'relative',
  width: '100%',
  height: '20px',
  padding: '0',
  marginBottom: $isActive ? `5px` : '0',
  background: $isActive ? colorMainGradient : colorBlack3,
  textAlign: 'center',
  border: 'none',
  cursor: 'pointer',
  opacity: $isDragging ? '0' : '1',

  '&::before': {
    content: '""',
    position: 'absolute',
    right: '15px',
    top: '7px',
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderBottom: `6px solid ${colorWhite}`,
  },
  ...($isActive
    ? {
      '&::before': {
          borderLeft: '0',
          borderRight: '0',
          borderTop: '0',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          right: '15px',
          top: '7px',
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: `6px solid ${colorWhite}`,
        },
      }
    : {}),
}));
