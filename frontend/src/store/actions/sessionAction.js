import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const wait = () =>
    new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
});

export const fetchSession = createAsyncThunk(
    "sessions/fetchSession",
    async({ token, idSession }, thunkApi) => {
        try {
            const response = await axios.get(`/expressjs/sessions/${idSession}`, {
                headers: {
                    'auth-token': token
                }
            })
            await wait()
            return response.data
        } catch(error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)
    
export const fetchSessions = createAsyncThunk(
    "sessions/fetchSessions",
    async (_, thunkApi) => {
        try {
            const response = await axios.get('/expressjs/sessions')
            await wait()
            return response.data
        } catch(error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

export const fetchSessionsByPlay = createAsyncThunk(
    'sessions/fetchByPlay',
    async ({ idPlay }) => {
        try {
            const response = await axios.get(`/expressjs/sessions/play/${idPlay}`)
            await wait()
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)


/* До event sourcing`а, теперь long polling  */
export const fetchSlotsBySession = createAsyncThunk(
    'sessions/fetchSlotsBySession',
    async ({ token, idSession }, thunkApi) => {
        try {
            const response = await axios.get(`/expressjs/sessions/${idSession}/slots`, {
                headers: {
                    'auth-token': token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            await wait()
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

export const fetchSessionFilterOptions = createAsyncThunk(
    'sessions/fetchSessionFilterOptions',
    async (_, thunkApi) => {
        try {
            const response = await axios.get('/expressjs/sessions/filter/setup')
            await wait()
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

export const fetchFilteredSessions = createAsyncThunk(
    'sessions/fetchFilteredSessions',
    async ({ dateFrom, dateTo, auditoriumTitle, playTitle }, thunkApi) => {
        try {
            const response = await axios.get('/expressjs/sessions/filter', {
                params: {
                    dateFrom,
                    dateTo,
                    "auditorium_title": auditoriumTitle,
                    "play_title": playTitle
                }
            })
            await wait()
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)


export const createSessionsCSV = createAsyncThunk(
    'sessions/createSessionsCSV',
    async ({ token, file }, thunkApi) => {
        try {
            const formData = new FormData()
            formData.append('csv', file)
            const response = await axios.post('/expressjs/sessions/csv', formData, { headers: 
                { 'auth-token': token, 'Content-Type': 'multipart/form-data' } })
            return
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)
