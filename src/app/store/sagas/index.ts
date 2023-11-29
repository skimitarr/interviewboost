import { all } from 'redux-saga/effects';
import { appDataSaga } from './app-data.saga';

export function* rootSaga() {
    yield all([
        appDataSaga
    ]);
}
