import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from '../hooks';
import { useTranslation } from "react-i18next";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";

import { ICategory } from "./Types";
import { DragDropHooks } from "./Drag&DropHooks";
import { сolorBtn, сolorWhite, getCategoryRightSideStyles } from '@/css/styled';

type Props = {
  category: ICategory
  activeCategory: ICategory | null
  showQuestions: (category: ICategory) => void
  removeStoreCategory: (category: ICategory) => void
  addStoreCategory: (category: ICategory) => void
  dragDropElement: (sourceId: string, destinationId: string, func: any) => void
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>
}

export function CategoryRightSide({
  category,
  activeCategory,
  showQuestions,
  removeStoreCategory,
  addStoreCategory,
  dragDropElement,
  setCategories,
}: Props) {

  const [hoverBlockVisible, setHoverBlockVisible] = useState(false);
  const [isChoosen, setChoosen] = useState(false);
  const { t } = useTranslation();
  const storeCategories = useAppSelector((state) => state.categories);

  const { ref, isDragging } = DragDropHooks({
    type: 'categoryRightSide',
    item: category,
    dragDropElement,
    func: setCategories
  })
  const hasThisCategory = storeCategories.find(item => item.id === category.id)
  const styles = getCategoryRightSideStyles({ isDragging, hoverBlockVisible, isChoosen, hasThisCategory });

  useEffect(() => {
    if (activeCategory) {
      activeCategory.id === category.id ? setChoosen(true) : setChoosen(false);
    }
  }, [activeCategory])

  useEffect(() => {
    storeCategories.find(item => item.id === category.id) ? setHoverBlockVisible(true) : setHoverBlockVisible(false);
  }, [storeCategories])

  const handleAddCategory = useCallback((e: React.SyntheticEvent, category: ICategory) => {
    e.stopPropagation();
    addStoreCategory(category);
    setHoverBlockVisible(true);
  }, [category])

  const handleRemoveCategory = useCallback((e: React.SyntheticEvent, category: ICategory) => {
    e.stopPropagation();
    removeStoreCategory(category);
    setHoverBlockVisible(false);
  }, [category])

  return (
    <Box sx={{ margin: '0 auto' }}>

      <Box
        ref={ref}
        sx={styles}
        onClick={() => showQuestions(category)}
        onMouseEnter={() => setHoverBlockVisible(true)}
        onMouseLeave={() => setHoverBlockVisible(false)}
      >
        <Typography sx={{ paddingTop: '17px' }}>{category.title}</Typography>

        <Box sx={{
          width: '150px',
          height: '40px',
          padding: '22px 10px 8px 10px',
          opacity: hoverBlockVisible || hasThisCategory ? '1' : '0',
          transition: 'all 0.3s ease-in-out',
        }}>
          <Button variant="outlined"
            sx={{
              minWidth: '125px',
              height: '30px',
              border: hasThisCategory ? `1px solid ${сolorWhite}` : `1px solid ${сolorBtn}`,
              borderRadius: '5px',
              color: 'inherit',
            }}
            onClick={(e) => hasThisCategory ? handleRemoveCategory(e, category) : handleAddCategory(e, category)}
          >
            <Typography sx={{ fontSize: '12px' }}>
              {hasThisCategory ? t('cancel') : t('add')}
            </Typography>
          </Button>

        </Box>
      </Box>
    </Box>
  );
}
