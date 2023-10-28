import { createSlice } from '@reduxjs/toolkit';
import {userState} from '../types';import {
    Locales
} from '../enumes';

export const name = 'user';

const userInitialState: userState = {
    locale: Locales.English
};

export const userSlice = createSlice({
    name,
    initialState: userInitialState,
    reducers: {
        setLanguage(state, action) {
            state.locale = action.payload;
        },
    },
});

export const { setLanguage } = userSlice.actions;
