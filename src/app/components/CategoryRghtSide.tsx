import { useDrag, useDrop } from "react-dnd"
import { useRef, useState } from "react"
import { useAppSelector } from '../hooks'
import { useTranslation } from "react-i18next";

import { ICategory, ICategoryRightSide } from "./Types"
import { InputQuestion } from "./InputQuestion";

export function CategoryRightSide({
  category,
  activeCategoriesName,
  showQuestions,
  removeStoreCategory,
  addStoreCategory,
  selectAllQuestions,
  questions,
  selectQuestions,
  checkedIdQuestions,
  dragDropElement,
  setCategories,
  setQuestions,
}: ICategoryRightSide) {

  const [checked, setChecked] = useState<boolean>(true); //чекобокс выбрать все
  const ref: React.RefObject<HTMLDivElement> = useRef(null);
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

  const selectCurrentAllQuestions = (id: string) => {
    setChecked(!checked)
    selectAllQuestions(id, !checked)
  }

  return (
    <div className={`questions__technology ${isDragging ? 'dragging' : ''}`} ref={ref}>
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

      {activeCategoriesName.includes(category.title) &&
        <>
          <div className='questions__technology-questions-wrapper'>
            <input id={category.id} type="checkbox" className="checkbox"
              onChange={() => selectCurrentAllQuestions(category.id)}
              checked={checked} />
            <label htmlFor={category.id} className='questions__technology-questions'>
              <p className={`selectAll ${checked ? '' : 'isSelected'}`}>{t('selectAll')}</p>
            </label>
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
        </>}
    </div>
  )
}
