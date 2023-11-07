import classnames from "classnames";
import { useAppSelector } from '../hooks';
import { ICategory, IQuestion } from "./Types";
import { DragDropHooks } from "./Drag&DropHooks";

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
  const categoriesFromStore = useAppSelector((state) => state.categories);

  const { ref, isDragging } = DragDropHooks({
    type: 'inputRightSide',
    item,
    category,
    categoriesFromStore,
    checked: checkedIdQuestions.includes(item.id),
    dragDropElement,
    func: setQuestions
  })

  return (
    <div className='questions__technology-questions-wrapper'>
      <input id={`question-${item.id}`} className="checkbox" type="checkbox" onChange={() => selectQuestions(item.id, category)}
        checked={checkedIdQuestions.includes(item.id)} />
      <label htmlFor={`question-${item.id}`} className='questions__technology-questions'>
        <p ref={ref}
          className={classnames(
            'questions__technology-questions-text',
            { 'dragging': isDragging },
            { 'isSelected': !checkedIdQuestions.includes(item.id) }
          )}
        >{index + 1}. {item.text}</p>
      </label>
    </div>
  )
}
