import { useTranslation } from 'react-i18next';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { ICategory } from './Types';
import { StyledInput } from './InputQuestion/style';
import { useCallback } from 'react';

type Props = {
  category: ICategory;
  onSelectAll: (categoryId: string, stateButtonAllQuestions: boolean) => void;
  checkedIdAllQuestions: string[];
};

export function SelectAllQuestions({ category, onSelectAll, checkedIdAllQuestions }: Props) {
  const { t } = useTranslation();

  const checked = checkedIdAllQuestions.includes(category.id);

  const handleChangeSelectAll = useCallback(() => {
    onSelectAll(category.id, !checked);
  }, [onSelectAll, category.id, checked]);

  return (
    <StyledInput isChecked={checked}>
      <FormControlLabel
        control={<Checkbox />}
        label={t('selectAll')}
        checked={checked}
        onChange={handleChangeSelectAll}
      />
    </StyledInput>
  )
}
