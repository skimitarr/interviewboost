import styled from '@mui/material/styles/styled';

type Props = {
  isDragging: boolean;
  hoverBlockVisible: boolean;
  isChoosen: boolean;
  hasThisCategory: boolean;
}

export const StyledCategoryCard = styled('div')<Props>(({  theme: { custom } }) => ({
  isDragging,
  hoverBlockVisible,
  isChoosen,
  hasThisCategory
}) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '150px',
  height: hoverBlockVisible || hasThisCategory ? '100px' : '60px',
  margin: '0 5px 5px 0',
  marginBottom: hoverBlockVisible || hasThisCategory ? '5px' : '45px',
  border: 'none',
  borderRadius: '4px',
  background: isChoosen ? custom.colorMainGradient : custom.colorTwilightSlate,
  cursor: 'pointer',
  opacity: isDragging ? '0' : '1',
  transition: 'all 0.3s ease-in-out',
}));
