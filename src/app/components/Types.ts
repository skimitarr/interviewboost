export interface DataState {
  profession: IProffesion | null;
  grades: IGrade[];
  allCategories: ICategory[];
  categories: ICategory[];
  questions: IQuestion[];
  answers: IAnswer[];
  currentIdQuestion: string;
  checkedQuestionDragDrop: string;
}

export interface IProffesion {
  id: string;
  desc: string;
  title: string;
  grades: string[]
}

export interface IGrade {
  id: string
  title: string
  categories: string[]
}

export interface ICategory {
  id: string
  title: string
  questions: string[]
}

export interface IQuestion {
  id: string
  text: string
  answers: string[]
}

export interface IAnswer {
  id: string
  text: string
}

export interface ILeftPart {
  // id: string
  // getId: (id: string) => void;
  getQuestionText?: (title: string) => void;
  getCategoryTitle?: (title: string) => void;
  pageName?: string
}

export interface ISearchReport {
  getCurrentReport?: (item: DataReport, id: string) => void;
  pageName?: string
}

export type DataReport = {
  [blockName: string]: (string | number | undefined)[][];
} & AdditionalData;

type AdditionalData = {
  id?: string
  name: string;
  conclusion?: [string, string];
};

type NavLink = {
  label: string
  href: string
}

export type Props = {
  navLinks: NavLink[]
}

export type ICategoryLeftSide = {
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

export type ICategoryRightSide = {
  category: ICategory
  activeCategoriesName: string[]
  showQuestions: (categoryTitle: string) => void
  removeStoreCategory: (category: ICategory) => void
  addStoreCategory: (category: ICategory) => void
  selectAllQuestions: (categoryId: string, statebuttonAllQuestions: boolean) => void
  questions: IQuestion[]
  selectQuestions: (questionId: string, questionCategory: ICategory) => void
  checkedIdQuestions: string[]
  dragDropElement: (sourceId: string, destinationId: string, func: any) => void
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>
  setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>
}

export type IInputQuestion = {
  item: IQuestion
  index: number
  category: ICategory
  selectQuestions: (questionId: string, questionCategory: ICategory) => void
  checkedIdQuestions: string[]
  dragDropElement: (sourceId: string, destinationId: string, func: any) => void
  setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>
}

export type IQuestionLeftSide = {
  item: IQuestion
  index: number
  сurrentIdQuestion: string
  showHighliting: boolean
  pageName?: string
  dragDropElement: (sourceId: string, destinationId: string, func: any) => void
  handleQuestion: (questionText: string, questionId: string) => void
  setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>
}
