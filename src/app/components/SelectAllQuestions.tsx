import { useTranslation } from "react-i18next";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { ICategory } from "./Types";
import { StyledInput } from "./InputQuestion/style";

type Props = {
  category: ICategory
  selectAllQuestions: (categoryId: string, statebuttonAllQuestions: boolean) => void
  checkedIdAllQuestions: string[]
}

export function SelectAllQuestions({ category, selectAllQuestions, checkedIdAllQuestions }: Props) {
  const { t } = useTranslation();
  const checked = checkedIdAllQuestions.includes(category.id);

  return (
    <StyledInput $isChecked={checked}>
      <FormControlLabel
        control={<Checkbox />}
        label={t('selectAll')}
        checked={checked}
        onChange={() => selectAllQuestions(category.id, !checked)}
      />
    </StyledInput>
  )
}
