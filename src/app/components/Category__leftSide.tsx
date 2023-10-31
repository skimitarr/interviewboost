import { useDrag, useDrop } from "react-dnd"
import { useRef } from "react"

import { ICategory, IQuestion } from "./Types"
import Question__leftSide from "./Question__leftSide";

export default function Category__leftSide({
  category,
  isActiveCategoryHandler,
  showQuestions,
  activeCategoriesName,
  questions,
  сurrentIdQuestion,
  showHighliting,
  pageName,
  dragDropElement,
  handleQuestion,
  setQuestions,
  setStoreCategories
}:
  {
    category: ICategory,
    isActiveCategoryHandler: (categoryTitle: string) => string | undefined,
    showQuestions: (categoryTitle: string) => void,
    activeCategoriesName: string[],
    сurrentIdQuestion: string,
    showHighliting: boolean,
    pageName?: string,
    questions: IQuestion[],
    dragDropElement: (sourceId: string, destinationId: string, func: any) => void,
    handleQuestion: (questionText: string, questionId: string) => void,
    setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>
    setStoreCategories: React.Dispatch<React.SetStateAction<ICategory[]>>,
  }) {

  const ref = useRef(null);

  const [{ isDragging }, dragCategory] = useDrag({
    type: 'categoryRightSide',
    item: { id: category.id, category },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const [{ isOver }, dropCategory] = useDrop(() => ({
    accept: 'categoryRightSide', // Тип элемента, который этот контейнер может принимать
    drop({ id: sourceId, category }:
      { id: string; type: string; category: ICategory }) {
      if (sourceId !== category.id) {
        dragDropElement(sourceId, category.id, setStoreCategories)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover({ id: draggedId }) {
      if (draggedId !== category.id) { // item.id это элемент на котором ховер
        dragDropElement(draggedId, category.id, setStoreCategories); // для стилизации перетаскивания элементов
      }
    },
  }));

  dragCategory(ref)
  dropCategory(ref)

  return (
    <div className='questions__choosenQuestions-wrapper' ref={ref}>
      <button className={`questions__choosenQuestions ${isActiveCategoryHandler(category.title) ? 'active' : ''} ${isDragging ? 'dragging' : ''}`} onClick={() => showQuestions(category.title)}>
        {category.title}
      </button>

      {activeCategoriesName.includes(category.title) &&
        questions
          .map((question, index) => question && (
            <Question__leftSide
              key={question.id}
              item={question}
              index={index}
              сurrentIdQuestion={сurrentIdQuestion}
              showHighliting={showHighliting}
              pageName={pageName}
              dragDropElement={dragDropElement}
              handleQuestion={handleQuestion}
              setQuestions={setQuestions}
            />
          )
          )}
    </div>
  )
}
