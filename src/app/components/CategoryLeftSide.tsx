import classnames from "classnames";
import { ICategory, IQuestion } from "./Types";
import { QuestionLeftSide } from "./QuestionLeftSide";
import { DragDropHooks } from "./Drag&DropHooks";

type Props = {
  category: ICategory
  isActiveCategoryHandler: (categoryTitle: string) => string | undefined
  showQuestions: (categoryTitle: string) => void
  activeCategoriesName: string[]
  сurrentIdQuestion: string
  showHighliting: boolean
  pageName?: string
  questions: IQuestion[]
  dragDropElement: (sourceId: string, destinationId: string, func: any) => void
  handleQuestion: (questionText: string, questionId: string) => void
  setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>
  setStoreCategories: React.Dispatch<React.SetStateAction<ICategory[]>>
}

export function CategoryLeftSide({
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
}: Props) {

  const { ref, isDragging } = DragDropHooks({
    type: 'categoryLeftSide',
    item: category,
    dragDropElement,
    func: setStoreCategories
  })

  return (
    <div className='questions__choosenQuestions-wrapper' ref={ref}>
      <button onClick={() => showQuestions(category.title)}
        className={classnames(
          'questions__choosenQuestions',
          { 'active': isActiveCategoryHandler(category.title) },
          { 'dragging': isDragging }
        )}
      >
        {category.title}
      </button>

      {activeCategoriesName.includes(category.title) && questions.map((question, index) => question && (
        <QuestionLeftSide
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
      ))}
    </div>
  )
}
