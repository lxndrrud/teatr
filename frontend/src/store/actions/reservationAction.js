import { 
    ERROR_RESERVATION,
    ERROR_CONFIRMATION,
    POST_RESERVATION,
    SET_RESERVATION, 
    ADD_SLOT,
    DELETE_SLOT,
    ERROR_RESERVATION_SET_DEFAULT,
    FETCH_RESERVATIONS,
    DELETE_RESERVATION,
    PAYMENT_RESERVATION,
    FETCH_RESERVATION,
    CLEAR_SLOTS,
    FETCH_FILTERED_RESERVATIONS,
    FETCH_RESERVATION_FILTER_OPTIONS
} from "../types"

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


export const setReservation = (payload) => async dispatch => {
    dispatch({
        type: SET_RESERVATION,
        payload: {
            id: payload.id,
            confirmation_code: payload.confirmation_code,
            id_session: payload.id_session
        }
    })
}

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

export const addSlot = (payload) => async dispatch => {
    dispatch({
        type: ADD_SLOT,
        payload: {
            seat_number: payload.seat_number,
            row_number: payload.row_number,
            price: payload.price,
            id: payload.id
        }
    })
}


export const deleteSlot = (payload) => async dispatch => {
    dispatch({
        type: DELETE_SLOT,
        payload: {
            seat_number: payload.seat_number,
            row_number: payload.row_number,
            price: payload.price,
            id: payload.id
        }
    })
}

export const errorSetDefault = () => async dispatch => {
    dispatch({
        type: ERROR_RESERVATION_SET_DEFAULT
    })
}

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

export const clearSlots = () => async dispatch => {
    dispatch({
        type: CLEAR_SLOTS,
    })
}

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