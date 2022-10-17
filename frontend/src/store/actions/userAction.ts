import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
//import { LOG_IN, LOG_OUT, REGISTER, ERROR_USER, ERROR_USER_SET_DEFAULT, FETCH_PERSONAL_AREA, CHANGE_PASSWORD, CHANGE_PERSONAL_INFO, SUCCESS_USER_SET_DEFAULT, SET_USER_SUCCESS, CREATE_USERS_CSV } from "../types";

const wait = () =>
    new Promise((resolve) => {
        setTimeout(() => resolve(1), 500);
});

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

export const getPersonalArea = createAsyncThunk<any, { token: string }>(
    'users/getPersonalArea',
    async ({ token }, thunkApi) => {
        try {
            const response = await axios.get('/expressjs/users/personalArea', { headers: { 'auth-token': token } })
            await wait()
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

export const changePassword = createAsyncThunk<any, { token: string, passwordInfo: {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  } }>(
    'users/editPassword',
    async ({ token, passwordInfo }, thunkApi) => {
        try {
            const response = await axios.put('/expressjs/users/edit/password', passwordInfo, 
                { headers: { 'auth-token': token } })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)


export const changePersonalInfo = createAsyncThunk<any, { token: string, personalInfo: {
    firstname: string;
    middlename: string;
    lastname: string;
}}>(
    'users/changePersonalInfo',
    async({ token, personalInfo }, thunkApi) => {
        try {
            const response = await axios.put('/expressjs/users/edit/personal', personalInfo,
                { headers: { 'auth-token': token } })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

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

export const createUsersCSV = createAsyncThunk<any, {token: string, file: File}>(
    'users/createUsers/csv',
    async({ token, file }, thunkApi) => {
        const formData = new FormData()
        formData.append('csv', file)
        try {
            const response = await axios.post('/expressjs/users/csv/create', formData, 
                { headers: { 'auth-token': token, 'Content-Type': 'multipart/form-data' } })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

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
