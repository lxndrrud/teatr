import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
//import { LOG_IN, LOG_OUT, REGISTER, ERROR_USER, ERROR_USER_SET_DEFAULT, FETCH_PERSONAL_AREA, CHANGE_PASSWORD, CHANGE_PERSONAL_INFO, SUCCESS_USER_SET_DEFAULT, SET_USER_SUCCESS, CREATE_USERS_CSV } from "../types";

export const register = createAsyncThunk<any, { email: string, password: string, firstname?: string, middlename?: string, lastname?: string }>(
    'users/register',
    async ({email, password, firstname, middlename, lastname }, thunkApi) => {
        try {
            const response = await axios.post(`/expressjs/users`, 
                { email, password, firstname, middlename, lastname })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

/*
export const register = (email, password, 
firstname=undefined, middlename=undefined, lastname=undefined) => async dispatch => {
    const response = await fetch(`/expressjs/users`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
            firstname,
            middlename,
            lastname
        })
    })
    const json_ = await response.json()

    if (response.status === 201)
        dispatch({
            type: REGISTER,
            payload: json_
        })
    else 
        dispatch({
            type: ERROR_USER,
            payload: json_.message
        })
}
*/

export const logIn = createAsyncThunk<any, { email: string, password: string }>(
    'users/login',
    async ({ email, password }, thunkApi) => {
        try {
            const response = await axios.post(`/expressjs/users/login`, { email, password })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
})

/*
export const logIn = (email, password) => async dispatch =>  {
    const response = await fetch(`/expressjs/users/login`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    })
    const json_ = await response.json()

    if (response.status === 200)
        dispatch({
            type: LOG_IN,
            payload: json_
        })
    else 
        dispatch({
            type: ERROR_USER,
            payload: json_.message
        })

}
*/

/*
export const logInAdmin = (email, password) => async dispatch =>  {
    const response = await fetch(`/expressjs/users/adminLogin`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    })
    const json_ = await response.json()

    if (response.status === 200)
        dispatch({
            type: LOG_IN,
            payload: json_
        })
    else 
        dispatch({
            type: ERROR_USER,
            payload: json_.message
        })
}
*/

/*

export const logOut = () => async dispatch => {
    dispatch({
        type: LOG_OUT
    })
}

export const errorSetDefault = () => async dispatch => {
    dispatch({
        type: ERROR_USER_SET_DEFAULT
    })
}

export const successSetDefault = () => async dispatch => {
    dispatch({
        type: SUCCESS_USER_SET_DEFAULT
    })
}
*/

export const getPersonalArea = createAsyncThunk<any, { token: string }>(
    'users/getPersonalArea',
    async ({ token }, thunkApi) => {
        try {
            const response = await axios.get('/expressjs/users/personalArea', { headers: { 'auth-token': token } })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

/*
export const getPersonalArea = (token) => async dispatch => {
    try {
        let response = await fetch('/expressjs/users/personalArea', {
            headers: {
                'auth-token': token
            }
        })
    
        let respBody = await response.json()
        if (response.status === 200) 
            dispatch({
                type: FETCH_PERSONAL_AREA,
                payload: respBody
            })
        else throw respBody.message
    } catch(e) {
        dispatch({
            type: ERROR_USER,
            payload: e 
        })
    }
}
*/

export const changePassword = createAsyncThunk<any, { token: string, passwordInfo: {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  } }>(
    'users/editPassword',
    async ({ token, passwordInfo }, thunkApi) => {
        try {
            const response = await axios.post('/expressjs/users/edit/password', passwordInfo, 
                { headers: { 'auth-token': token } })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

/*
export const changePassword = (token, passwordInfo) => async dispatch => {
    try {
        let response = await fetch('/expressjs/users/edit/password', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify(passwordInfo)
        })

        if (response.status === 200) 
            dispatch({
                type: CHANGE_PASSWORD,
                success_message: "Пароль успешно обновлён!"
            })
        else {
            let respBody = await response.json()
            throw respBody.message
        }

    } catch(e) {
        dispatch({
            type: ERROR_USER,
            payload: e
        })
    }
}
*/

export const changePersonalInfo = createAsyncThunk<any, { token: string, personalInfo: {
    firstname: string;
    middlename: string;
    lastname: string;
}}>(
    'users/changePersonalInfo',
    async({ token, personalInfo }, thunkApi) => {
        try {
            const response = await axios.post('/expressjs/users/edit/personal', { personalInfo },
                { headers: { 'auth-token': token } })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

/*
export const changePersonalInfo = (token, personalInfo) => async dispatch => {
    try {  
        const response = await fetch('/expressjs/users/edit/personal', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify(personalInfo)
        })

        if (response.status === 200) 
            dispatch({
                type: CHANGE_PERSONAL_INFO,
                success_message: "Личная информация обновлена!"
            })
        else {
            let respBody = await response.json()
            throw respBody.message
        }
    } catch(e) {
        dispatch({
            type: ERROR_USER,
            payload: e
        })
    }
}
*/

export const restorePassword = createAsyncThunk<any, {email: string}>(
    'users/restorePassword',
    async({ email }, thunkApi) => {
        try {
            const response = await axios.post('/expressjs/users/restore/password', { email })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

/*
export const restorePassword = (email) => async dispatch => {
    try {
        const response = await fetch('/expressjs/users/restore/password', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        })

        if (response.status === 200) {
            dispatch({
                type: SET_USER_SUCCESS,
                success_message: "Временный пароль был отправлен на почту!"
            })
        } 
        else {
            let respBody = await response.json()
            throw respBody.message
        }

    } catch (e) {
        dispatch({
            type: ERROR_USER,
            payload: e
        })
    }
}
*/

export const createUsersCSV = createAsyncThunk<any, {token: string, file: File}>(
    'users/createUsers/csv',
    async({ token, file }, thunkApi) => {
        const formData = new FormData()
        formData.append('csv', file)
        try {
            const response = await axios.postForm('/expressjs/users/csv/create', formData, 
                { headers: { 'auth-token': token } })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

/*
export const createUsersCSV = (token, file) => async dispatch => {
    const formData = new FormData()
    formData.append('csv', file)
    const response = await fetch('/expressjs/users/csv/create', {
        headers: {
            //'Content-Type': 'multipart/form-data',
            'auth-token': token
        },
        method: "POST",
        body: formData
    })

    if (response.status !== 200 ) {
        let body = await response.json()
        dispatch({
            type: ERROR_USER,
            payload: body.message
        })
    } else {
        let body = await response.json()
        dispatch({
            type: CREATE_USERS_CSV,
            success_message: body.success,
            errors: body.errors
        })
    }
}
*/

export const resendRestoreEmail = createAsyncThunk<any, {email: string}>(
    'users/restorePassword/resendEmail', 
    async ({ email }, thunkApi ) => {
        try {
            const response = await axios.post('/expressjs/users/restore/password/resendEmail', { email })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
})
