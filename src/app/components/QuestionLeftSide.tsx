import classnames from "classnames";
import { IQuestion } from "./Types";
import { DragDropHooks } from "./Drag&DropHooks";

type Props = {
  item: IQuestion
  index: number
  currentIdQuestion: string
  showHighliting: boolean
  pageName?: string
  dragDropElement: (sourceId: string, destinationId: string, func: any) => void
  handleQuestion: (questionText: string, questionId: string) => void
  setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>
}

export function QuestionLeftSide({
  item,
  index,
  currentIdQuestion,
  showHighliting,
  pageName,
  dragDropElement,
  handleQuestion,
  setQuestions
}: Props) {

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
        { 'highlited': item.id === currentIdQuestion && showHighliting },
        { 'cursor': pageName === 'interview' },
        { 'dragging': isDragging }
      )}
    >
      {index + 1}. {item.text}
    </p>
  )
}
