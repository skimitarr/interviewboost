import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ICategory, IQuestion } from "./Types";

type Props = {
  type: string
  item: ICategory | IQuestion
  category?: ICategory
  categoriesFromStore?: ICategory[]
  checkedIdQuestions?: string[]
  dragDropElement: (sourceId: string, destinationId: string, func: any) => void
  // func: React.Dispatch<React.SetStateAction<IQuestion[]>>
  func: any
}

export function DragDropHooks({
  type,
  item,
  category,
  categoriesFromStore,
  checkedIdQuestions,
  dragDropElement,
  func
}: Props) {
  const ref: React.RefObject<HTMLDivElement> = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: type,
    item: { id: item.id, category, categoriesFromStore, checkedIdQuestions },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop(() => ({
    accept: type, // Тип элемента, который этот контейнер может принимать
    drop({ id: sourceId, category, categoriesFromStore, checkedIdQuestions }: // category, categoriesFromStore, checked передаем в PageFormLeftSide из-за ассинхронщины там не получить актуальные данные
      { id: string; type: string; category: ICategory, categoriesFromStore: ICategory[], checkedIdQuestions: string[] }) {
      if (sourceId !== item.id) {
        dragDropElement(sourceId, item.id, func)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover({ id: draggedId }) {
      console.log('jojo', draggedId, item.id)
      if (draggedId !== item.id) { // item.id это элемент на котором ховер
        dragDropElement(draggedId, item.id, func); // для стилизации перетаскивания элементов
      }
    },
  }));

  drag(ref);
  drop(ref);

  return { ref, isDragging }
}
