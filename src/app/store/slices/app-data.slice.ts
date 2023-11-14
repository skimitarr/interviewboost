import { createSlice } from '@reduxjs/toolkit';
import { ICategory } from '../../components/Types';
import { AppDataState } from '../types';

export const name = 'appData';

const userInitialState: AppDataState = {
  profession: null,
  grades: [],
  allCategories: [],
  categories: [],
  questions: [],
  answers: [],
  currentIdQuestion: '',
  checkedQuestionDragDrop: {id: '', timestamp: 0}
};

export const appDataSlice = createSlice({
  name,
  initialState: userInitialState,
  reducers: {
    getProfession(state, action) {
      state.profession = action.payload;
    },
    getGrades(state, action) {
      state.grades = action.payload;
    },
    getAllCategories(state, action) {
      state.allCategories = action.payload;
    },
    getCategories(state, action) {
      state.categories = action.payload;
    },
    addCategory(state, action) {
      const index = state.categories.findIndex((item: ICategory) =>item.id === action.payload.id);
      if (index !== -1) { // Если объект найден, удаляем его из массива
        state.categories.splice(index, 1);
      }
      state.categories = [action.payload, ...state.categories];
      state.categories = state.categories.sort((a: any, b: any) => a.id - b.id);
    },
    removeCategory(state, action) {
      const index = state.categories.findIndex((item: ICategory) => item.id === action.payload.id);
      if (index !== -1) { // Если объект найден, удаляем его из массива
        state.categories.splice(index, 1);
      }
    },
    getQuestions(state, action) {
      state.questions = action.payload;
    },
    getAnswers(state, action) {
      state.answers = action.payload;
    },
    getCurrentIdQuestion(state, action) {
      state.currentIdQuestion = action.payload;
    },
    getCheckedQuestionDragDrop(state, action) {
      state.checkedQuestionDragDrop = action.payload;
    },
  },
});

export const { getProfession, getGrades, getAllCategories, getCategories, addCategory, removeCategory,
  getQuestions, getAnswers, getCurrentIdQuestion, getCheckedQuestionDragDrop } = appDataSlice.actions;
