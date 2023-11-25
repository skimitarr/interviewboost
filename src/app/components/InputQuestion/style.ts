import styled from '@mui/material/styles/styled';
import { colorWhite, сolorBtn } from '@/css/variables';

type Props = {
  $isDragging?: boolean;
  $isChecked: boolean;
}

export const StyledInput = styled('div')<Props>(({ $isDragging, $isChecked }) => ({
  width: ' 100%',
  minHeight: '30px',
  marginBottom: '10px',
  padding: '10px 15px',
  color: $isChecked ? colorWhite : `gray`,
  letterSpacing: '0.5px',
  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
  opacity: $isDragging ? '0' : '1',

  '& .MuiTypography-root': {
    fontSize: '14px',
  },
  '& .MuiSvgIcon-root': {
    display: 'none',
  },
  '& .MuiTypography-root::before': {
    content: '"\\00a0"',
    display: 'inline-block',
    width: '24px',
    height: '24px',
    paddingTop: '2px',
    margin: '3px 30px 3px 0',
    border: `1px inset ${colorWhite}`,
    borderRadius: '5px',
    textAlign: 'center',
  },
  '& .Mui-checked + .MuiTypography-root::before': {
    content: '"\\2713"',
    border: `1px inset ${сolorBtn}`,
  },
}));
