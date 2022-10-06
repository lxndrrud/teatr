import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const wait = () =>
    new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
});

export const fetchPlay = createAsyncThunk(
    'plays/fetchPlay',
    async ({ idPlay }, thunkApi) => {
        try {
            const response = await axios.get(`/expressjs/plays/${idPlay}`)
            await wait()
            return response.data
        } catch(error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)


export const fetchPlays = createAsyncThunk(
    'plays/fetchPlays',
    async (_, thunkApi) => {
        try {
            const response = await axios.get(`/expressjs/plays/`)
            await wait()
            return response.data
        } catch(error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

export const createPlaysCSV = createAsyncThunk(
    'plays/createPlaysCSV',
    async ({ token, file }, thunkApi) => {
        try {
            const formData = new FormData()
            formData.append('csv', file)
            const response = await axios.post(`/expressjs/plays/`, formData, { headers: {
                'auth-token': token, 'Content-Type': 'multipart/form-data'
            }})
            return
        } catch(error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

