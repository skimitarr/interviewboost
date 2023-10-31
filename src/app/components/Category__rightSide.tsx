import { useDrag, useDrop } from "react-dnd"
import { useRef } from "react"
import { useAppSelector } from '../hooks'
import { useTranslation } from "react-i18next";

import { ICategory, IQuestion } from "./Types"
import InputQuestion from "./InputQuestion";

export default function Category__rightSide({
  category,
  activeCategoriesName,
  showQuestions,
  removeStoreCategory,
  addStoreCategory,
  selectAllQuestions,
  checkedStates,
  questions,
  selectQuestions,
  checkedIdQuestions,
  dragDropElement,
  setCategories,
  setQuestions }:
  {
    category: ICategory,
    activeCategoriesName: string[],
    showQuestions: (categoryTitle: string) => void,
    removeStoreCategory: (category: ICategory) => void,
    addStoreCategory: (category: ICategory) => void,
    selectAllQuestions: (questionCategory: ICategory, itemId: string) => void,
    checkedStates: { [key: string]: boolean },
    questions: IQuestion[],
    selectQuestions: (questionId: string, questionCategory: ICategory) => void,
    checkedIdQuestions: string[],
    dragDropElement: (sourceId: string, destinationId: string, func: any) => void,
    setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>,
    setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>
  }) {

  const ref = useRef(null);
  const { t } = useTranslation();
  const storeCategories = useAppSelector((state) => state.categories)

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
        dragDropElement(sourceId, category.id, setCategories)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover({ id: draggedId }) {
      if (draggedId !== category.id) { // item.id это элемент на котором ховер
        dragDropElement(draggedId, category.id, setCategories); // для стилизации перетаскивания элементов
      }
    },
  }));

  dragCategory(ref)
  dropCategory(ref)

  return (
    <div className='questions__technology' ref={ref}>
      <div className='questions__technology-wrapper1'>

        <div className='questions__technology-wrapper2'>
          <button
            className={`questions__technology-name ${activeCategoriesName.includes(category.title) ? 'active' : ''} ${storeCategories.find(item => item.id === category.id) ? 'isChoosen' : ''} ${isDragging ? 'dragging' : ''}`}
            onClick={() => showQuestions(category.title)}
          >
            {category.title}
          </button>
          <p className="questions__technology-name-shadow"></p>
        </div>

        {storeCategories.find(item => item.id === category.id)
          ? <button className='questions__technology-btn questions__technology btn' onClick={() => removeStoreCategory(category)}>{t('cancel')}</button>
          : <button className='questions__technology-btn isChoosen btn' onClick={() => addStoreCategory(category)}>{t('add')}</button>}
      </div>

      {activeCategoriesName.includes(category.title) ? (
        <>
          <div className='questions__technology-questions-wrapper'>
            <input id={category.id} type="checkbox" className="checkbox"
              onChange={() => selectAllQuestions(category, category.id)}
              checked={checkedStates[category.id] || false} />
            <label htmlFor={category.id} className='questions__technology-questions'>{t('selectAll')}</label>
          </div>
          <div>
            {questions.map((item, index) => (
              <InputQuestion key={item.id}
                item={item}
                index={index}
                category={category}
                selectQuestions={selectQuestions}
                checkedIdQuestions={checkedIdQuestions}
                dragDropElement={dragDropElement}
                setQuestions={setQuestions}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
