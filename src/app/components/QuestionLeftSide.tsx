import classnames from "classnames";
import { IQuestionLeftSide } from "./Types";
import { DragDropHooks } from "./Drag&DropHooks";

export function QuestionLeftSide({
  item,
  index,
  сurrentIdQuestion,
  showHighliting,
  pageName,
  dragDropElement,
  handleQuestion,
  setQuestions
}: IQuestionLeftSide) {

  const { ref, isDragging } = DragDropHooks({
    type: 'questionLeftSide',
    item,
    dragDropElement,
    func: setQuestions
  })

  return (
    <p ref={ref} onClick={() => handleQuestion(item.text, item.id)}
      className={classnames(
        'questions__technology-questions questions__leftQustions',
        { 'highlited': item.id === сurrentIdQuestion && showHighliting },
        { 'cursor': pageName === 'interview' },
        { 'dragging': isDragging }
      )}
    >
      {index + 1}. {item.text}
    </p>
  )
}
