import { createSlice } from '@reduxjs/toolkit';
import { DataState , ICategory } from '../../components/Types';

export const dataSlice = createSlice({
  name: 'interviews',
  initialState: {
    profession: null,
    grades: [],
    allCategories: [],
    categories: [],
    questions: [],
    answers: [],
    currentIdQuestion: '',
  } as DataState,
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
  },
});

export const { getProfession, getGrades, getAllCategories, getCategories, addCategory, removeCategory,
  getQuestions, getAnswers, getCurrentIdQuestion } = dataSlice.actions;
