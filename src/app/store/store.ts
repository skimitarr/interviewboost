import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import { rootSaga } from './sagas/app-dataSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga); // Запуск саг

export default store;

// лучший способ, чтобы не писать свой тип для селектора
export type RootState = ReturnType<typeof store.getState>;
// дока советует сделать так
export type AppDispatch = typeof store.dispatch;
