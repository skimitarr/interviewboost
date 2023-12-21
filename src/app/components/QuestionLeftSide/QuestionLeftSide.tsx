import { IQuestion } from "../Types";
import { DragDropHooks } from "../Drag&DropHooks";
import { StyledQuestion } from "./style";

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
    <StyledQuestion
      ref={ref}
      onClick={() => handleQuestion(item.text, item.id)}
      isActive={item.id === currentIdQuestion && showHighliting}
      needCursor={pageName === 'interview'}
      isDragging={isDragging}
    >
      {index + 1}. {item.text}
    </StyledQuestion>
  )
}
