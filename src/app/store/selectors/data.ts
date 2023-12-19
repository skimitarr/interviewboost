import pathOr from 'ramda/es/pathOr';

import { AppDataState } from '../types';
import { appDataInitialState, appDataSlice } from '../slices/app-data.slice';

export const selectFromAppData = <Key extends keyof AppDataState>(
    field: keyof AppDataState,
    defaultValue: AppDataState[Key],
) => pathOr<AppDataState[Key]>(defaultValue, [appDataSlice.name, field]);

export const selectQuestions = selectFromAppData('questions', appDataInitialState.questions);
export const selectCategoriesByGrade = selectFromAppData('categoriesByGrade', appDataInitialState.categoriesByGrade);
export const selectActiveCategory = selectFromAppData('activeCategory', appDataInitialState.activeCategory);


export const selectQuestionByCategory = (state: AppDataState) => {
  const questions = selectQuestions(state);
  const categoriesByGrade = selectCategoriesByGrade(state);
  const activeCategory = selectActiveCategory(state);

  return questions
    .filter((item) => categoriesByGrade
      .flatMap(category => category.questions).includes(item.id) && activeCategory.questions.includes(item.id))
}
