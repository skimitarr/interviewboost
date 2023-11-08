import {
    Locales
} from './enumes';
import {IAnswer, ICategory, IGrade, IProffesion, IQuestion} from "@/app/components/Types";

export type UserState = {
    locale: Locales
};

export type AppDataState = {
    profession: IProffesion | null;
    grades: IGrade[];
    allCategories: ICategory[];
    categories: ICategory[];
    questions: IQuestion[];
    answers: IAnswer[];
    currentIdQuestion: string;
    checkedQuestionDragDrop: string;
}

export type StoreState = {
    user: UserState,
    appData: AppDataState,
}
