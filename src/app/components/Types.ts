export type DataState = {
  profession: IProffesion | null;
  grades: IGrade[];
  allCategories: ICategory[];
  categories: ICategory[];
  questions: IQuestion[];
  answers: IAnswer[];
  currentIdQuestion: string;
  checkedQuestionDragDrop: {id: string, timestamp: number};
}

export type IProffesion = {
  id: string;
  desc: string;
  title: string;
  grades: string[]
}

export type IGrade = {
  id: string
  title: string
  categories: string[]
}

export type ICategory = {
  id: string
  title: string
  questions: string[]
}

export type IQuestion = {
  id: string
  text: string
  answers: string[]
}

export type IAnswer = {
  id: string
  text: string
}

export type DataReport = {
  [blockName: string]: (string | number | undefined)[][];
} & AdditionalData;

type AdditionalData = {
  id?: string
  name: string;
  conclusion?: [string, string];
};

export type CheckedQuestionDragDrop = {
  id: string,
  timestamp: number
};
