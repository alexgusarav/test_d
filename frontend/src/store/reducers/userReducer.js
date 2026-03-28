import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

const initialState = {
    userData: null,
    isAuthenticated: false,
    sessionId: Cookies.get('sessionid') || null,
    csrfToken:  Cookies.get('csrftoken') || null,
}

export const userReducer = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userData = action.payload;
            state.isAuthenticated = true;
        },
        logoutUser: (state) => {
            state.userData = null;
            state.isAuthenticated = null;
            state.sessionId = null;
            state.csrfToken = null;
        },
        syncAuthTokens: (state) => {
            state.sessionId = Cookies.get('sessionid');
            state.csrfToken = Cookies.get('csrftoken');
        },
        clearAuthTokens: (state) => {
            state.sessionId = null;
            state.csrfToken = null;
        },
        setCsrfToken: (state,action) => {
            state.csrfToken = action.payload;
        }
    },
});

export const { setUser, logoutUser, syncAuthTokens, clearAuthTokens, setCsrfToken} = userReducer.actions;
export default userReducer.reducer