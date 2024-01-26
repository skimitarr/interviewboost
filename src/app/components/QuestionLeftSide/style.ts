import styled from '@mui/material/styles/styled';

type Props = {
  isActive: boolean;
  needCursor: boolean;
  isDragging: boolean;
}

export const StyledQuestion = styled('p')<Props>(({isActive, needCursor, isDragging, theme: { custom } }) => ({
  marginBottom: isDragging ? '30px' : '0',
  padding: '5px 0 5px 20px',
  color: isActive ? custom.colorAzureBlue : custom.colorSnowWhite,
  letterSpacing: '0.5px',
  fontSize: '14px',
  cursor: needCursor ? 'pointer' : 'grab',
  opacity: isDragging ? '0' : '1',
  transition: 'backgroundColor 0.3s ease-in-out',

  '&:hover': {
    backgroundColor: custom.colorTwilightSlate
  },
}))

