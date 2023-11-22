import { useSelector } from "react-redux";
import applySpec from 'ramda/es/applySpec';
import fastDeepEqual from "fast-deep-equal";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DragDropHooks } from '../Drag&DropHooks';
import { ICategory, IQuestion } from '../Types';
import { selectFromAppData } from '@/app/store/selectors/data';
import { StoreState } from "@/app/store/types";
import { StyledInput } from "./style";

type Selector = {
  categoriesFromStore: ICategory[],
};

const selector = applySpec<Selector>({
  categoriesFromStore: selectFromAppData('categories', []),
});

type Props = {
  item: IQuestion
  index: number
  category: ICategory
  selectQuestions: (questionId: string, questionCategory: ICategory) => void
  checkedIdQuestions: string[]
  dragDropElement: (sourceId: string, destinationId: string, func: any) => void
  setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>
}

export function InputQuestion({
  item,
  index,
  category,
  selectQuestions,
  checkedIdQuestions,
  dragDropElement,
  setQuestions
}: Props) {
  const { categoriesFromStore } = useSelector<StoreState, Selector>(selector, fastDeepEqual);

  const isChecked = checkedIdQuestions.includes(item.id); // useMemo будет неправильно передавать данные в род. компонент

  const set = new Set(checkedIdQuestions.filter((item) => category.questions.includes(item)));
  const arrayFromSet: string[] = [];
  set.forEach((item) => arrayFromSet.push(item));

  const { ref, isDragging } = DragDropHooks({
    type: 'inputRightSide',
    item,
    category,
    categoriesFromStore,
    checkedIdQuestions: arrayFromSet,
    dragDropElement,
    func: setQuestions
  })

  return (
    <StyledInput $isDragging={isDragging} $isChecked={isChecked}>
      <FormControlLabel
        ref={ref}
        control={<Checkbox />}
        label={`${index + 1}. ${item.text}`}
        checked={isChecked}
        onChange={() => selectQuestions(item.id, category)}
      />
    </StyledInput>
  )
}
