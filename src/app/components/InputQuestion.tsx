import classnames from "classnames";
import { useAppSelector } from '../hooks';
import { IInputQuestion } from "./Types";
import { DragDropHooks } from "./Drag&DropHooks";

export function InputQuestion({ item, index, category, selectQuestions, checkedIdQuestions, dragDropElement, setQuestions }: IInputQuestion) {
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
