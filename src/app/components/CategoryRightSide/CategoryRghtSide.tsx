import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import applySpec from 'ramda/es/applySpec';
import fastDeepEqual from 'fast-deep-equal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";

import { ICategory } from '../Types';
import { DragDropHooks } from '../Drag&DropHooks';
import { selectFromAppData } from '@/app/store/selectors/data';
import { StoreState } from '@/app/store/types';
import { StyledCategoryCard } from "./styles";
import { setCategoryByGrade } from '@/app/store/slices/app-data.slice';

type Selector = {
  storeCategories: ICategory[],
};

const selector = applySpec<Selector>({
  storeCategories: selectFromAppData('categories', []),
});

type Props = {
  category: ICategory
  activeCategoryId: string
  showQuestions: (category: ICategory) => void
  removeStoreCategory: (category: ICategory) => void
  addStoreCategory: (category: ICategory) => void
  dragDropElement: (sourceId: string, destinationId: string, func: any) => void
}

function CategoryRightSide({
  category,
  activeCategoryId,
  showQuestions,
  removeStoreCategory,
  addStoreCategory,
  dragDropElement,
}: Props) {

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { storeCategories } = useSelector<StoreState, Selector>(selector, fastDeepEqual);

  const [hoverBlockVisible, setHoverBlockVisible] = useState(false);

  const handleSetCategories = (getCategoriesOrder) => {
    dispatch(setCategoryByGrade(getCategoriesOrder()));
  };

  const { ref, isDragging } = DragDropHooks({
    type: 'categoryRightSide',
    item: category,
    dragDropElement,
    func: handleSetCategories
  });

  useEffect(() => {
    setHoverBlockVisible(storeCategories.some(item => item.id === category.id));
  }, [storeCategories])

  const handleCategoryAction = (e: React.SyntheticEvent, category: ICategory, hasThisCategory: boolean) => {
    e.stopPropagation();
    if (hasThisCategory) {
      removeStoreCategory(category);
    } else {
      addStoreCategory(category);
    };
    setHoverBlockVisible(hasThisCategory);
  };

  const hasThisCategory = useMemo(() => storeCategories.some(item => item.id === category.id),
    [storeCategories, category.id]);

  return (
    <Box sx={{margin: '0 auto'}}>
      {activeCategoryId && (
        <StyledCategoryCard
          ref={ref}
          isDragging={isDragging}
          hoverBlockVisible={hoverBlockVisible}
          isChoosen={activeCategoryId === category.id}
          hasThisCategory={hasThisCategory}
          onClick={() => showQuestions(category)}
          onMouseEnter={() => setHoverBlockVisible(true)}
          onMouseLeave={() => setHoverBlockVisible(false)}
        >
          <Typography sx={{paddingTop: '19px'}}>{category.title}</Typography>

          <Box
            sx={{
              width: '150px',
              height: '40px',
              padding: '22px 10px 8px 10px',
              opacity: hoverBlockVisible || hasThisCategory ? '1' : '0',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <Button
              variant="outlined"
              onClick={(e) => handleCategoryAction(e, category, hasThisCategory)}
              sx={({custom}) => ({
                minWidth: '125px',
                height: '30px',
                border: hasThisCategory ? `1px solid ${custom.colorSnowWhite}` : `1px solid ${custom.colorAzureBlue}`,
                borderRadius: '5px',
                color: 'inherit',
              })}
            >
              <Typography sx={{fontSize: '12px'}}>
                {hasThisCategory ? t('cancel') : t('add')}
              </Typography>
            </Button>
          </Box>
        </StyledCategoryCard>
      )}
    </Box>
  );
}

export const MemoizedCategoryRightSide = React.memo(CategoryRightSide);
