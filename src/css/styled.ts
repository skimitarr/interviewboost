import { ICategory } from "@/app/components/Types";
import { SxProps, Theme } from "@mui/system";

interface CategoryRightSideStylesProps {
  isDragging: boolean;
  hoverBlockVisible: boolean;
  isChoosen: boolean;
  hasThisCategory: ICategory | undefined;
}

export const сolorBtn = '#557CFC';
export const сolorWhite = '#FFF';
export const colorBlack3 = '#3C3E49';
export const colorMainGradient = 'linear-gradient(180deg, #557CFC 0%, rgba(85, 124, 252, 0.09) 100%)';

export const getCategoryRightSideStyles = ({ isDragging, hoverBlockVisible, isChoosen, hasThisCategory }: CategoryRightSideStylesProps): SxProps<Theme> => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '150px',
  height: hoverBlockVisible || hasThisCategory ? '100px' : '60px',
  margin: '0 5px 5px 0',
  marginBottom: hoverBlockVisible || hasThisCategory ? '5px' : '45px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: isChoosen ? 'transparent' : colorBlack3,
  backgroundImage: isChoosen ? colorMainGradient : 'none',
  color: 'white',
  cursor: 'pointer',
  opacity: isDragging ? '0' : '1',
  transition: 'all 0.3s ease-in-out',
});
