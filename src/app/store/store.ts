import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: [sagaMiddleware],
})

export default store;

// лучший способ, чтобы не писать свой тип для селектора
export type RootState = ReturnType<typeof store.getState>;
// дока советует сделать так
export type AppDispatch = typeof store.dispatch;
