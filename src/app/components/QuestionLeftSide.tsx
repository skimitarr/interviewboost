import Typography from "@mui/material/Typography"
import { IQuestion } from "./Types";
import { DragDropHooks } from "./Drag&DropHooks";
import { colorWhite, сolorBtn } from '@/css/variables';

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
    <Typography
      ref={ref}
      onClick={() => handleQuestion(item.text, item.id)}
      sx={{
        marginBottom: '10px',
        paddingLeft: item.id === currentIdQuestion && showHighliting ? '40px' : '20px',
        color: item.id === currentIdQuestion && showHighliting ? сolorBtn : colorWhite,
        letterSpacing: '0.5px',
        fontSize: '14px',
        cursor: pageName === 'interview' ? 'pointer' : 'grab',
        opacity: isDragging ? '0' : '1',
      }}
    >
      {index + 1}. {item.text}
    </Typography>
  )
}
