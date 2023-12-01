import Box from "@mui/material/Box";
import { DragDropHooks } from "../Drag&DropHooks";
import { QuestionLeftSide } from "../QuestionLeftSide";
import { ICategory, IQuestion } from "../Types";
import { StyledLeftSide } from "./styles";

type Props = {
  category: ICategory
  isActiveCategoryHandler: (categoryTitle: string) => boolean
  showQuestions: (categoryTitle: string) => void
  activeCategoriesName: string[]
  currentIdQuestion: string
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
  currentIdQuestion,
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
    <Box sx={{ paddingBottom: '5px', fontSize: '14px', }} ref={ref}>
      <StyledLeftSide
        onClick={() => showQuestions(category.title)}
        isActive={isActiveCategoryHandler(category.title)}
        isDragging={isDragging}
      >
        {category.title}
      </StyledLeftSide>

      {activeCategoriesName.includes(category.title)
        && questions.map((question, index) => (
          <QuestionLeftSide
            key={question.id}
            item={question}
            index={index}
            currentIdQuestion={currentIdQuestion}
            showHighliting={showHighliting}
            pageName={pageName}
            dragDropElement={dragDropElement}
            handleQuestion={handleQuestion}
            setQuestions={setQuestions}
          />
        ))}
    </Box>
  )
}
