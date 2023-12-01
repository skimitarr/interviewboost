import {
    Locales
} from './enumes';
import {IAnswer, ICategory, IGrade, IProffesion, IQuestion, CheckedQuestionDragDrop} from "@/app/components/Types";

export type UserState = {
    locale: Locales
};

export type AppDataState = {
    allProfessions: IProffesion[];
    profession: IProffesion | null;
    grades: IGrade[];
    allCategories: ICategory[];
    categories: ICategory[];
    questions: IQuestion[];
    answers: IAnswer[];
    currentIdQuestion: string;
    checkedQuestionDragDrop: CheckedQuestionDragDrop;
}

export type StoreState = {
    user: UserState,
    appData: AppDataState,
}
