import { useDrag, useDrop } from "react-dnd"
import { useRef } from "react"
import { IQuestion } from "./Types"

export default function Question__leftSide({ item, index, сurrentIdQuestion, showHighliting, pageName, dragDropQuestion, handleQuestion }:
  {
    item: IQuestion,
    index: number,
    сurrentIdQuestion: string,
    showHighliting: boolean,
    pageName?: string,
    dragDropQuestion: (sourceId: string, destinationId: string) => void,
    handleQuestion: (questionText: string, questionId: string) => void
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
        dragDropQuestion(sourceId, item.id)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover({ id: draggedId }) {
      if (draggedId !== item.id) { // item.id это элемент на котором ховер
        dragDropQuestion(draggedId, item.id); // для стилизации перетаскивания элементов
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
