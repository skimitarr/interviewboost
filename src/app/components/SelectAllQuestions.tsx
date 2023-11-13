import classnames from "classnames";
import { useTranslation } from "react-i18next";
import { ICategory } from "./Types";

type Props = {
  category: ICategory
  selectAllQuestions: (categoryId: string, statebuttonAllQuestions: boolean) => void
  checkedIdAllQuestions: string[]
}

export function SelectAllQuestions({ category, selectAllQuestions, checkedIdAllQuestions }: Props) {
  const { t } = useTranslation();

  const checked = checkedIdAllQuestions.includes(category.id);

  return (
    <div className='questions__technology-questions-wrapper'>
      <input id={category.id} type="checkbox" className="checkbox"
        onChange={() => selectAllQuestions(category.id, !checked)}
        checked={checked} />
      <label htmlFor={category.id} className='questions__technology-questions'>
        <p className={classnames('selectAll', { 'isSelected': !checked })}>{t('selectAll')}</p>
      </label>
    </div>
  )
}
