import { db } from '@/firebase'
import { collection,  getDocs,} from "firebase/firestore";
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { getAllProfessions, getProfession, getGrades, getAllCategories, getQuestions, getAnswers, } from '../slices/app-data.slice';
import { IAnswer, ICategory, IGrade, IProffesion, IQuestion } from '@/app/components/Types';

export function* watchAllProfessions() {
  yield takeEvery('actionType/getAllProfessions', workAllProfessions);
}

const getDbProfessions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "professions"));
    const professions: IProffesion[] = [];
    querySnapshot.forEach((item) => {
      professions.push({
        title: item.data().title,
        id: item.data().id,
        desc: item.data().desc,
        grades: item.data().grades,
      });
    });
    return professions;
  } catch (error) {
    console.error('Error getting documents:', error);
    return [];
  }
};

function* workAllProfessions() {
  const items: IProffesion[] = yield call(getDbProfessions);
  yield put(getAllProfessions(items));
}

// ---------------------------------------------------
export function* watchProfession() {
  //'appData/getProfession' равно getProfession.type и вызывает бесконечный цикл, поэтому меняем тип экшена
  yield takeEvery('actionType/getProfession', workProfession);
}

function* workProfession(action: PayloadAction<IProffesion>) {
  const { payload } = action;
  yield put(getProfession(payload));
}

// ---------------------------------------------------
export function* watchAllGrades() {
  yield takeEvery('actionType/getAllGrades', workAllGrades);
}

const getDbAllGrades = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "grades"));
    const grades: IGrade[] = [];
    querySnapshot.forEach((item) => {
      grades.push({
        title: item.data().title,
        id: item.data().id,
        categories: item.data().categories,
      });
    });
    return grades;
  } catch (error) {
    console.error('Error getting selected documents:', error);
    return [];
  }
};

function* workAllGrades() {
  const items: IGrade[] = yield call(getDbAllGrades);
  yield put(getGrades(items));
}

// ---------------------------------------------------
export function* watchAllCategories() {
  yield takeEvery('actionType/getAllCategories', workAllCategories);
}

const getDbAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories: ICategory[] = [];
    querySnapshot.forEach((item) => {
      categories.push({
        title: item.data().title,
        id: item.data().id,
        questions: item.data().questions,
      });
    });
    const sortedCategories = categories.sort((a: ICategory, b: ICategory) => +a.id - +b.id)
    return sortedCategories;
  } catch (error) {
    console.error('Error getting selected documents:', error);
    return [];
  }
};

function* workAllCategories() {
  const items: ICategory[] = yield call(getDbAllCategories);
  yield put(getAllCategories(items));
}

// ---------------------------------------------------
export function* watchAllQuestions() {
  yield takeEvery('actionType/getAllQuestions', workAllQuestions);
}

const getDbAllQuestions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'questions'));
    const questions: IQuestion[] = [];
      querySnapshot.forEach((item) => {
        questions.push({
          text: item.data().text,
          id: item.data().id,
          answers: item.data().answers,
        });
      });
    const sortedQuestions = questions.sort((a: IQuestion, b: IQuestion) => +a.id - +b.id)
    return sortedQuestions;
  } catch (error) {
    console.error('Error getting selected documents:', error);
    return [];
  }
};

function* workAllQuestions() {
  const items: IQuestion[] = yield call(getDbAllQuestions);
  yield put(getQuestions(items));
}

// ---------------------------------------------------
export function* watchAllAnswers() {
  yield takeEvery('actionType/getAllAnswers', workAllAnswers);
}

const getDbAllAnswers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'answers'));
    const answers: IAnswer[] = [];
      querySnapshot.forEach((item) => {
        answers.push({
          text: item.data().text,
          id: item.data().id,
        });
      });

    return answers;
  } catch (error) {
    console.error('Error getting selected documents:', error);
    return [];
  }
};

function* workAllAnswers() {
  const items: IAnswer[] = yield call(getDbAllAnswers);
  yield put(getAnswers(items));
}

// ---------------------------------------------------
export function* rootSaga() {
  yield all([
    watchAllProfessions(),
    watchProfession(),
    watchAllGrades(),
    watchAllCategories(),
    watchAllQuestions(),
    watchAllAnswers(),
  ]);
}
