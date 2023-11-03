import { useState } from "react";
import { useAppSelector } from '../hooks';
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import { ICategoryRightSide } from "./Types";
import { InputQuestion } from "./InputQuestion";
import { DragDropHooks } from "./Drag&DropHooks";

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
  const { t } = useTranslation();
  const storeCategories = useAppSelector((state) => state.categories);

  const { ref, isDragging } = DragDropHooks({
    type: 'categoryRightSide',
    item: category,
    dragDropElement,
    func: setCategories
  })

  const selectCurrentAllQuestions = (id: string) => {
    setChecked(!checked)
    selectAllQuestions(id, !checked)
  }

  return (
    <div className={classnames('questions__technology', { 'dragging': isDragging })} ref={ref}>
      <div className='questions__technology-wrapper1'>

        <div className='questions__technology-wrapper2'>
          <button
            className={classnames(
              'questions__technology-name',
              { 'active': activeCategoriesName.includes(category.title) },
              { 'isChoosen': storeCategories.find(item => item.id === category.id) },
              { 'dragging': isDragging }
            )}
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
              <p className={classnames('selectAll', { 'isSelected': !checked })}>{t('selectAll')}</p>
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
