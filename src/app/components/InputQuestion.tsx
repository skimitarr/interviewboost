import { useDrag, useDrop } from "react-dnd"
import { useRef } from "react"
import { useAppSelector } from '../hooks'

import { ICategory, IInputQuestion } from "./Types"

export function InputQuestion({ item, index, category, selectQuestions, checkedIdQuestions, dragDropElement, setQuestions }: IInputQuestion) {
  const categoriesFromStore = useAppSelector((state) => state.categories);
  const ref: React.RefObject<HTMLDivElement> = useRef(null);

  const [{ isDragging }, dragQuestions] = useDrag({
    type: 'inputRightSide',
    item: { id: item.id, category, categoriesFromStore, checked: checkedIdQuestions.includes(item.id) },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const [{ isOver }, dropQuestions] = useDrop(() => ({
    accept: 'inputRightSide', // Тип элемента, который этот контейнер может принимать
    drop({ id: sourceId, category, categoriesFromStore, checked }:
      { id: string; type: string; category: ICategory, categoriesFromStore: ICategory[], checked: boolean }) {
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
    <div className={`questions__technology-questions-wrapper `}>
      <input id={`question-${item.id}`} className="checkbox" type="checkbox" onChange={() => selectQuestions(item.id, category)}
        checked={checkedIdQuestions.includes(item.id)} />
      <label htmlFor={`question-${item.id}`} className='questions__technology-questions'>
        <p ref={ref} className={`questions__technology-questions-text ${isDragging ? 'dragging' : ''} ${checkedIdQuestions.includes(item.id) ? '' : 'isSelected'}`}>{index + 1}. {item.text}</p>
      </label>
    </div>
  )
}
