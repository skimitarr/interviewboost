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
  setQuestions,
  getAnswers, setCheckedCategoriesIds, setActiveCategory, setActiveGrade, setCategoryByGrade,
} from '../slices/app-data.slice';
import {
  IProffesion,
  IGrade,
  ICategory,
  IQuestion,
  IAnswer,
} from '@/app/components/Types';
import { selectFromAppData } from '@/app/store/selectors/data';
import { select } from '@redux-saga/core/effects';

function* handleGetStoreData(action) {
  try {
    yield put({type: 'actionType/getProfession', payload: action.payload});
    yield put({type: 'actionType/getAllGrades'});
    yield put({type: 'actionType/getAllCategories'});
    yield put({type: 'actionType/getAllQuestions'});
    yield put({type: 'actionType/getAllAnswers'});
  } catch (error) {
    console.error('Error getting store data:', error);
  }
}

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
    const grades = querySnapshot.docs.map((item) => ({
      title: item.data().title,
      id: item.data().id,
      categories: item.data().categories,
    }));
    yield put(getGrades(grades));
    yield put(setActiveGrade(grades[0]));
  } catch (error) {
    console.error('Error getting selected documents:', error);
  }
}

function* handleGetAllCategories() {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = yield call(getDocs, collection(db, 'categories'));
    const activeGrade = yield select(selectFromAppData('activeGrade', null));
    const categories: ICategory[] = querySnapshot.docs
      .map((item) => ({
        title: item.data().title,
        id: item.data().id,
        questions: item.data().questions,
      }))
      .sort((a: ICategory, b: ICategory) => +a.id - +b.id);

    const categoriesByGrade = categories
      .filter((item) => activeGrade?.categories.includes(item.id))
      .sort((a: ICategory, b: ICategory) => +a.id - +b.id);

    yield put(setCheckedCategoriesIds(categories.map(category => category.id)));
    yield put(getAllCategories(categories));
    yield put(setActiveCategory(categories[0]));
    yield put(setCategoryByGrade(categoriesByGrade));
  } catch (error) {
    console.error('Error getting selected documents:', error);
  }
}

function* handleGetAllQuestions() {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = yield call(getDocs,collection(db, 'questions'));
    const questions = querySnapshot.docs
      .map((item) => ({
        text: item.data().text,
        id: item.data().id,
        answers: item.data().answers,
      }))
      .sort((a: IQuestion, b: IQuestion) => +a.id - +b.id);


    //    if (categoriesByGrade.length > 0) {
    //       const set = new Set();
    //       categoriesByGrade.forEach(category => {
    //         category.questions.forEach(item => {
    //           set.add(item)
    //         })
    //       });
    //       const arrayOfIds = Array.from(set); // получаем все id вопросов со всех тем
    //       console.log('storeQuestions', categoriesByGrade, set, arrayOfIds)
    //
    //       const questionsData = storeQuestions.filter((item) => arrayOfIds.includes(item.id))
    //       console.log('questionsData', questionsData)
    //
    //       // dispatch(setQuestions(questionsData));
    //     }

    yield put(setQuestions(questions));
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
  yield takeLatest('actionType/getStoreData', handleGetStoreData);
  yield takeLatest('actionType/getAllQuestions', handleGetAllQuestions);
  yield takeLatest('actionType/getAllCategories', handleGetAllCategories);
  yield takeLatest('actionType/getAllGrades', handleGetAllGrades);
  yield takeLatest('actionType/getAllAnswers', handleGetAllAnswers);
  yield takeLatest('actionType/getProfession', handleGetProfession);
  yield takeLatest('actionType/getAllProfessions', handleGetAllProfessions);
}
