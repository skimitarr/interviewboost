import {combineReducers} from '@reduxjs/toolkit';
import {dataSlice} from './slices/data.slice';
import {userSlice} from './slices/user.slice';

export const rootReducer = combineReducers({
        user: userSlice.reducer,
        data: dataSlice.reducer,
    }
)
