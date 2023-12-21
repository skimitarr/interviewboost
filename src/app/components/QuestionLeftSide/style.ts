import styled from '@mui/material/styles/styled';

type Props = {
  isActive: boolean;
  needCursor: boolean;
  isDragging: boolean;
}

export const StyledQuestion = styled('p')<Props>(({isActive, needCursor, isDragging, theme: { custom } }) => ({
  marginBottom: '10px',
  paddingLeft: isActive ? '40px' : '20px',
  color: isActive ? custom.colorAzureBlue : custom.colorSnowWhite,
  letterSpacing: '0.5px',
  fontSize: '14px',
  cursor: needCursor ? 'pointer' : 'grab',
  opacity: isDragging ? '0' : '1',
  transition: 'padding 0.3s ease-in-out, backgroundColor 0.3s ease-in-out',

  '&:hover': {
    padding: '15px 0 15px 40px',
    margin: '0 -27px 10px',
    backgroundColor: custom.colorTwilightSlate
  },
}))

