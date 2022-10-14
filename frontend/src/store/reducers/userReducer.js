import { createSlice } from "@reduxjs/toolkit"
import { changePassword, changePersonalInfo, createUsersCSV, getPersonalArea, logIn, register, restorePassword } from "../actions/userAction"


const initialState = {
    token: '',
    isAdmin: null,
    user: null,
    error: null,
    success: null,
    isLoading: false,
    errorsCSV: []
}

const pending = (state) => {
    state.isLoading = true
}

const rejected = (state, action) =>  {
    console.log(action)
    state.isLoading = false
    if (action) state.error = action.error.message
}

const defaultFullfilled = (state) => {
    rejected(state)
}

export const userReducer = createSlice({
    name: 'users',
    initialState,
    reducers: {
        logOut(state, action) {
            state.token = initialState.token
            state.isAdmin = initialState.isAdmin
        },
        errorSetDefault(state, action) {
            state.error = initialState.error
        },
        successSetDefault(state, action) {
            state.success = initialState.success
        },
        errorsCSVSetDefault(state, action) {
            state.errorsCSV = initialState.errorsCSV
        }
    },
    extraReducers: {
        [logIn.fulfilled]: (state, action) => {
            state.token = action.payload.token
            state.isAdmin = action.payload.isAdmin ? action.payload.isAdmin : false
            defaultFullfilled(state)
        }, 
        [logIn.pending]: pending,
        [logIn.rejected]: rejected,

        [register.fulfilled]: (state, action) => {
            state.token = action.payload.token
            state.isAdmin = action.payload.isAdmin ? action.payload.isAdmin : false
            defaultFullfilled(state)
        }, 
        [register.pending]: pending,
        [register.rejected]: rejected,

        [getPersonalArea.fulfilled]: (state, action) => {
            state.user = action.payload.user
            defaultFullfilled(state)
        }, 
        [getPersonalArea.pending]: pending,
        [getPersonalArea.rejected]: rejected,

        [restorePassword.fulfilled]: defaultFullfilled,
        [restorePassword.pending]: pending,
        [restorePassword.rejected]: rejected,

        [changePassword.fulfilled]: defaultFullfilled,
        [changePassword.pending]: pending,
        [changePassword.rejected]: rejected,

        [changePersonalInfo.fulfilled]: defaultFullfilled,
        [changePersonalInfo.pending]: pending,
        [changePersonalInfo.rejected]: rejected,

        [createUsersCSV.fulfilled]: (state, action) => {
            state.errorsCSV = action.payload.errors
            defaultFullfilled(state)
        },
        [createUsersCSV.pending]: pending,
        [createUsersCSV.rejected]: rejected
    }
}) 

/*
const userReducer = (state=defaultState, action) => {
    switch(action.type) {
        case LOG_IN:
            return {...state, 
                token: action.payload.token, 
                isAdmin: action.payload.isAdmin ? action.payload.isAdmin : false
            }
        case LOG_OUT:
            return {...state, token: defaultState.token, isAdmin: defaultState.isAdmin}
        case REGISTER:
            return {...state, token: action.payload.token, isAdmin: false}
        case FETCH_PERSONAL_AREA:
            return {...state, user: action.payload.user }
        case ERROR_USER:
            return {...state, error: action.payload}
        case ERROR_USER_SET_DEFAULT:
            return {...state, error: defaultState.error}
        case CHANGE_PASSWORD: 
            return {...state, success: action.success_message }
        case CHANGE_PERSONAL_INFO: 
            return {...state, success: action.success_message }
        case SUCCESS_USER_SET_DEFAULT:
            return {...state, success: defaultState.success }
        case CREATE_USERS_CSV:
            return {...state, success: action.success_message, error: action.errors }
        default:
            return state
    }
}
*/

//export default userReducer