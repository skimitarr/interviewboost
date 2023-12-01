import { db } from '@/firebase'
import {
  QuerySnapshot,
  DocumentData,
  collection,
  getDocs,
} from "firebase/firestore";
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
  IGrade,
  ICategory,
  IQuestion,
  IAnswer,
} from '@/app/components/Types';

function* handleGetAllProfessions() {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = yield call(getDocs,collection(db, 'professions'));
    const professions: IProffesion[] = [];
    querySnapshot.forEach((item) => {
      professions.push({
        title: item.data().title,
        id: item.data().id,
        desc: item.data().desc,
        grades: item.data().grades,
      });
    });
    yield put(getAllProfessions(professions));
  } catch (error) {
    console.error('Error getting documents:', error);
  }
}

function* handleGetProfession(action: PayloadAction<IProffesion>) {
  const { payload } = action;
  yield put(getProfession(payload));
}

function* handleGetAllGrades() {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = yield call(getDocs, collection(db, 'grades'));
    const grades: IGrade[] = [];
    querySnapshot.forEach((item) => {
      grades.push({
        title: item.data().title,
        id: item.data().id,
        categories: item.data().categories,
      });
    });
    yield put(getGrades(grades));
  } catch (error) {
    console.error('Error getting selected documents:', error);
  }
}

function* handleGetAllCategories() {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = yield call(getDocs, collection(db, 'categories'));
    const categories: ICategory[] = [];
    querySnapshot.forEach((item) => {
      categories.push({
        title: item.data().title,
        id: item.data().id,
        questions: item.data().questions,
      });
    });
    const sortedCategories = categories.sort((a: ICategory, b: ICategory) => +a.id - +b.id)
    yield put(getAllCategories(sortedCategories));
  } catch (error) {
    console.error('Error getting selected documents:', error);
  }
}

function* handleGetAllQuestions() {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = yield call(getDocs,collection(db, 'questions'));
    const questions: IQuestion[] = [];
    querySnapshot.forEach((item) => {
      questions.push({
        text: item.data().text,
        id: item.data().id,
        answers: item.data().answers,
      });
    });
    const sortedQuestions = questions.sort((a: IQuestion, b: IQuestion) => +a.id - +b.id)
    yield put(getQuestions(sortedQuestions));
  } catch (error) {
    console.error('Error getting selected documents:', error);
  }
}

function* handleGetAllAnswers() {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = yield call(getDocs, collection(db, 'answers'));
    const answers: IAnswer[] = [];
    querySnapshot.forEach((item) => {
      answers.push({
        text: item.data().text,
        id: item.data().id,
      });
    });

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
