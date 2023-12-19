import { createSlice } from '@reduxjs/toolkit';
import { ICategory } from '../../components/Types';
import { AppDataState } from '../types';

export const name = 'appData';

export const appDataInitialState: AppDataState = {
  allProfessions: [],
  profession: null,
  grades: [],
  allCategories: [],
  categories: [],
  questions: [],
  answers: [],
  currentIdQuestion: '',
  checkedQuestionDragDrop: {id: '', timestamp: 0},
  checkedCategoriesIds: [],
  activeCategory: null,
  activeGrade: null,
  categoriesByGrade: [],
};

export const appDataSlice = createSlice({
  name,
  initialState: appDataInitialState,
  reducers: {
    getAllProfessions(state, action) {
      state.allProfessions = action.payload;
    },
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
    setQuestions(state, action) {
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
    setCheckedCategoriesIds(state, action) {
      state.checkedCategoriesIds = action.payload;
    },
    setActiveCategory(state, action) {
      state.activeCategory = action.payload;
    },
    setActiveGrade(state, action) {
      state.activeGrade = action.payload;
    },
    setCategoryByGrade(state, action) {
      state.categoriesByGrade = action.payload;
    },
  },
});

export const { getAllProfessions, getProfession, getGrades, getAllCategories, getCategories, addCategory, removeCategory,
  setQuestions, setCategoryByGrade, setActiveGrade, setActiveCategory, setCheckedCategoriesIds, getAnswers, getCurrentIdQuestion, getCheckedQuestionDragDrop } = appDataSlice.actions;
