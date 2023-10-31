import { useDrag, useDrop } from "react-dnd"
import { useRef } from "react"
import { IQuestion } from "./Types"

export default function Question__leftSide({ item, index, сurrentIdQuestion, showHighliting, pageName, dragDropElement, handleQuestion, setQuestions }:
  {
    item: IQuestion,
    index: number,
    сurrentIdQuestion: string,
    showHighliting: boolean,
    pageName?: string,
    dragDropElement: (sourceId: string, destinationId: string, func: any) => void,
    handleQuestion: (questionText: string, questionId: string) => void,
    setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>
  }) {


  const ref = useRef(null);
  const [{ isDragging }, dragQuestions] = useDrag({
    type: 'lefttSide',
    item: { id: item.id, },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const [, dropQuestions] = useDrop(() => ({
    accept: 'lefttSide',
    drop({ id: sourceId }:
      { id: string; type: string; }) {
      if (sourceId !== item.id) {
        dragDropElement(sourceId, item.id, setQuestions)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover({ id: draggedId }) {
      if (draggedId !== item.id) { // item.id это элемент на котором ховер
        dragDropElement(draggedId, item.id, setQuestions); // для стилизации перетаскивания элементов
      }
    },
  }));

  dragQuestions(ref)
  dropQuestions(ref)
  return (
    <p ref={ref}
      className={`questions__technology-questions questions__leftQustions ${item.id === сurrentIdQuestion && showHighliting ? 'highlited' : ''} ${pageName === 'interview' ? 'cursor' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={() => handleQuestion(item.text, item.id)}
    >
      {index + 1}. {item.text}
    </p>
  )
}
