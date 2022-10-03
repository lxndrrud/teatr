import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { FETCH_PLAY, FETCH_PLAYS, ERROR_PLAY, CLEAR_SUCCESS_ERROR_PLAY, SUCCESS_PLAY } from '../types'

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

/*
export const fetchPlay = (playid) => async dispatch =>  {
    const response = await fetch(`/expressjs/plays/${playid}`)
    const json_ = await response.json()
    dispatch({
        type: FETCH_PLAY,
        payload: json_
    })
}
*/
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

/*
export const fetchPlays = () => async dispatch =>  {
    const response = await fetch('/expressjs/plays')
    const json_ = await response.json()
    dispatch({
        type: FETCH_PLAYS,
        payload: json_
    })
}*/

export const createPlaysCSV = createAsyncThunk(
    'plays/createPlaysCSV',
    async ({ token, file }, thunkApi) => {
        try {
            const formData = new FormData()
            formData.append('csv', file)
            const response = await axios.post(`/expressjs/plays/`, formData, { headers: {
                'auth-token': token
            }})
            return
        } catch(error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

/*
export const createPlaysCSV = (token, file) => async dispatch => {
    const formData = new FormData()
    formData.append('csv', file)
    const response = await fetch('/expressjs/plays/csv', {
        headers: {
            //'Content-Type': 'multipart/form-data',
            'auth-token': token
        },
        method: "POST",
        body: formData
    })

    if (response.status !== 201 ) {
        let body = await response.json()
        dispatch({
            type: ERROR_PLAY,
            payload: body.message
        })
    }
    else {
        dispatch({
            type: SUCCESS_PLAY,
            payload: "Спектакли успешно загружены!"
        })
    }
}

export const clearSuccessErrorPlay = () => async dispatch => {
    dispatch({
        type: CLEAR_SUCCESS_ERROR_PLAY
    })
}
*/
