import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

/*
export const postReservation = ({ token, id_session, slots }) => async dispatch => {
    let body = {
        id_session, slots
    }
    let resp = await fetch('/expressjs/reservations', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token
        }, 
        method: 'POST', 
        body: JSON.stringify(body)
    })
    body = await resp.json()
    if (resp.status === 201) 
        dispatch({
            type: POST_RESERVATION,
            payload: {
                id: body.id,
                id_session: body.id_session,
                need_confirmation: body.need_confirmation
            }
        })
    else
        dispatch({
            type: ERROR_RESERVATION,
            payload: body.message
        })

}
*/

export const createReservation = createAsyncThunk(
    'reservations/createReservation',
    async ({ token, idSession, slots }, thunkApi) => {
        try {
            const body = {
                id_session: idSession,
                slots
            }
            const response = await axios.post('/expressjs/reservations', body, { headers: { 'auth-token': token } })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

export const confirmReservation = createAsyncThunk(
    'reservations/confirmReservation',
    async ({ token, id_reservation, id_session, confirmation_code }, thunkApi) => {
        try {
            const body = {
                confirmation_code: confirmation_code,
                id_session: id_session
            }
            const response = await axios.put( `/expressjs/reservations/${id_reservation.toString()}/confirm/`, body, {
                headers: { 'auth-token': token }
            })
            return
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)
/*
export const confirmReservation = ({ 
    token, 
    id_reservation, 
    id_session, 
    confirmation_code 
}) => async dispatch => {
    // send request and redirect 
    const body = {
        confirmation_code: confirmation_code,
        id_session: id_session
    }
    const url = `/expressjs/reservations/${id_reservation.toString()}/confirm/` 
    const resp = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token
        }, 
        method: 'PUT', 
        body: JSON.stringify(body)
    })
    
    if (resp.status !== 200) {
        const responseBody = await resp.json()
        dispatch({
            type: ERROR_CONFIRMATION,
            payload: responseBody.message
        })
    }
}
*/


export const fetchReservation = createAsyncThunk(
    'reservations/fetchReservation',
    async ({ token, idReservation }, thunkApi) => {
        try {
            console.log(token, idReservation)
            const response = await axios.get(`/expressjs/reservations/${idReservation}`, {
                headers: { 'auth-token': token }
            })
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

/*
export const fetchReservation = ({
    token,
    id_reservation
}) => async dispatch => {
    const url = `/expressjs/reservations/${id_reservation}`
    const resp = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token,
        },
        method: "GET"
    })

    const body = await resp.json()

    if (resp.status === 200) {
        dispatch({
            type: FETCH_RESERVATION,
            payload: body
        })
    }
    else {
        dispatch({
            type: ERROR_RESERVATION,
            payload: body.message
        })
    }
}
*/

export const fetchReservations = createAsyncThunk(
    'reservations/fetchReservations',
    async ({ token }) => {
        try {
            const response = await axios.get('/expressjs/reservations/', { headers: { 'auth-token': token } })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)
/*
export const fetchReservations = (token) => async dispatch => {
    const resp = await fetch('/expressjs/reservations/', {
        headers: {
            'auth-token': token
        }
    })
    const body = await resp.json()
    dispatch({
        type: FETCH_RESERVATIONS,
        payload: body
    })
}
*/

export const changePaymentStatus = createAsyncThunk(
    'reservations/changePaymentStatus',
    async ({ token, idReservation }, thunkApi) => {
        try {
            const response = await axios.put(`/expressjs/reservations/${idReservation}/payment`, null, {
                headers: { 'auth-token': token }
            })
            return
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)
/*
export const paymentStatusReservation = ({
    token, 
    id_reservation
}) => async dispatch => {
    const resp = await fetch(`/expressjs/reservations/${id_reservation}/payment`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token
        }
    })


    if (resp.status === 200)
        dispatch({
            type: PAYMENT_RESERVATION,
        })
    else {
        const responseBody = await resp.json()
        dispatch({
            type: ERROR_RESERVATION,
            payload: responseBody.message
        })
    }
       
}
*/

export const deleteReservation = createAsyncThunk(
    'reservations/deleteReservation',
    async ({ token , idReservation }, thunkApi) => {
        try {
            console.log(token, idReservation)
            const response = await axios.delete(`/expressjs/reservations/${idReservation}`, {
                headers: { 'auth-token': token }
            })
            return
        } catch (error) {
            console.log(error)
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

/*
export const deleteReservation = ({
    token, 
    id_reservation
}) => async dispatch => {
    const resp = await fetch(`/expressjs/reservations/${id_reservation}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token
        }
    })


    if (resp.status === 200)
        dispatch({
            type: DELETE_RESERVATION,
            payload: { id: parseInt(id_reservation) }
        })
    else {
        const responseBody = await resp.json()
        dispatch({
            type: ERROR_RESERVATION,
            payload: responseBody.message
        })
    }
       
}
*/


/*
export const fetchReservationFilterOptions = (token) => async dispatch => {
    const response = await fetch('/expressjs/reservations/filter/setup', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token
        },
        method: 'GET'
    })
    if (response.status === 200) {
        const json_ = await response.json()

        dispatch({
            type: FETCH_RESERVATION_FILTER_OPTIONS,
            payload: json_
        })
    }
}
*/

export const fetchReservationFilterOptions = createAsyncThunk(
    'reservations/fetchReservationFilterOptions',
    async ({ token }, thunkApi) => {
        try {
            const response = await axios.get('/expressjs/reservations/filter/setup', {
                headers: { 'auth-token': token }
            })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

export const fetchFilteredReservations = createAsyncThunk(
    'reservations/fetchFilteredReservations',
    async ({ token, dateFrom, dateTo, auditoriumTitle, playTitle, isLocked, idReservation }, thunkApi) => {
        try {
            const response = await axios.get('/expressjs/reservations/filter', {
                params: {
                    'dateFrom': dateFrom,
                    'dateTo': dateTo,
                    'auditorium_title': auditoriumTitle,
                    'play_title': playTitle,
                    'is_locked': isLocked,
                    'id_reservation': idReservation
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            })
            return response.data
        } catch (error) {
            throw new Error(error?.response?.data.message || 'Произошла непредвиденная ошибка')
        }
    }
)

/*
export const fetchFilteredReservations = (token, dateFrom, dateTo, auditoriumTitle, playTitle, isLocked, idReservation) => async dispatch => {
    const response = await fetch('/expressjs/reservations/filter?' + new URLSearchParams({
        'dateFrom': dateFrom,
        'dateTo': dateTo,
        'auditorium_title': auditoriumTitle,
        'play_title': playTitle,
        'is_locked': isLocked,
        'id_reservation': idReservation
        }),
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth-token': token
            },
            method: 'GET'
        }
    )

    if (response.status === 200) {
        const json_ = await response.json()

        dispatch({
            type: FETCH_FILTERED_RESERVATIONS,
            payload: json_
        })
    }   
    else {
        const json_ = await response.json()

        dispatch({
            type: ERROR_RESERVATION,
            payload:  json_.message
        })
    }
}
*/
