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
