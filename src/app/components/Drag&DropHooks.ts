import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ICategory, IDragDrop } from "./Types";

export function DragDropHooks({type, item, category, categoriesFromStore, checked, dragDropElement, func }: IDragDrop) {
  const ref: React.RefObject<HTMLDivElement> = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: type,
    item: { id: item.id, category, categoriesFromStore, checked },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop(() => ({
    accept: type, // Тип элемента, который этот контейнер может принимать
    drop({ id: sourceId, category, categoriesFromStore, checked }:
      { id: string; type: string; category: ICategory, categoriesFromStore: ICategory[], checked: boolean }) {
      if (sourceId !== item.id) {
        dragDropElement(sourceId, item.id, func)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover({ id: draggedId }) {
      if (draggedId !== item.id) { // item.id это элемент на котором ховер
        dragDropElement(draggedId, item.id, func); // для стилизации перетаскивания элементов
      }
    },
  }));

  drag(ref);
  drop(ref);

  return { ref, isDragging }
}
