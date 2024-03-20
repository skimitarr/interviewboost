import api from '@/app/api/config';

import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import {
  getAllProfessions,
  getProfession,
  getGrades,
  getAllCategories,
  getQuestions,
  getAnswers,
} from '../slices/app-data.slice';
import {
  IProffesion,
  ICategory,
  IQuestion,
} from '@/app/components/Types';

function* handleGetAllProfessions() {
  try {
    const response = yield call([api.appData, api.appData.getAllProfessions]);

    const professions = response.data.map((profession) => ({
        title: profession.title,
        id: profession.professionId,
        desc: profession.desc,
        grades: profession.grades,
      })
    );

    yield put(getAllProfessions(professions));

  } catch (error) {
    console.error('Error getting documents:', error);
  }
}

function* handleGetProfession(action: PayloadAction<IProffesion>) {
  const {payload} = action;
  yield put(getProfession(payload));
}

function* handleGetAllGrades() {
  try {
    const response = yield call([api.appData, api.appData.getAllGrades]);

    const grades = response.data.map((grade) => ({
        title: grade.title,
        id: grade.gradeId,
        categories: grade.categories,
      })
    );

    yield put(getGrades(grades));

  } catch (error) {
    console.error('Error getting selected documents:', error);
  }
}

function* handleGetAllCategories() {
  try {
    const response = yield call([api.appData, api.appData.getAllCategories]);

    const categories = response.data.map((category) => ({
        title: category.title,
        id: category.categoryId,
        questions: category.questions,
      })
    );

    const sortedCategories = categories.sort((a: ICategory, b: ICategory) => +a.id - +b.id)

    yield put(getAllCategories(sortedCategories));
  } catch (error) {
    console.error('Error getting selected documents:', error);
  }
}

function* handleGetAllQuestions() {
  try {
    const response = yield call([api.appData, api.appData.getAllQuestions]);

    const questions = response.data.map((question) => ({
        text: question.text,
        id: question.questionId,
        answers: question.answers,
      })
    );

    const sortedQuestions = questions.sort((a: IQuestion, b: IQuestion) => +a.id - +b.id)
    console.log('sortedQuestions', questions, sortedQuestions);
    yield put(getQuestions(sortedQuestions));
  } catch (error) {
    console.error('Error getting selected documents:', error);
  }
}

function* handleGetAllAnswers() {
  try {
    const response = yield call([api.appData, api.appData.getAllAnswers]);

    const answers = response.data.map((answer) => ({
        text: answer.text,
        id: answer.answerId,
      })
    );

    yield put(getAnswers(answers));
  } catch (error) {
    console.error('Error getting selected documents:', error);
  }
}

export function* appDataSaga() { // these are watchers
                                 // TODO: add action creators
  yield takeLatest('actionType/getAllQuestions', handleGetAllQuestions);
  yield takeLatest('actionType/getAllCategories', handleGetAllCategories);
  yield takeLatest('actionType/getAllGrades', handleGetAllGrades);
  yield takeLatest('actionType/getAllAnswers', handleGetAllAnswers);
  yield takeLatest('actionType/getProfession', handleGetProfession);
  yield takeLatest('actionType/getAllProfessions', handleGetAllProfessions);
}
