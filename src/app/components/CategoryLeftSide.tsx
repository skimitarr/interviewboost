import classnames from "classnames";
import { ICategoryLeftSide } from "./Types";
import { QuestionLeftSide } from "./QuestionLeftSide";
import { DragDropHooks } from "./Drag&DropHooks";

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
}: ICategoryLeftSide) {

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
