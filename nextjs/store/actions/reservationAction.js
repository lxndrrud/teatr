import { 
    ERROR_RESERVATION,
    ERROR_CONFIRMATION,
    POST_RESERVATION,
    SET_RESERVATION, 
    SHOW_CONFIRMATION_FIELD, 
    HIDE_CONFIRMATION_FIELD,
    ADD_SLOT,
    DELETE_SLOT,
    ERROR_SET_DEFAULT
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
    resp.status == 201 
        ? 
            dispatch({
                type: POST_RESERVATION,
                payload: {
                    id: body.id,
                    id_session: body.id_session
                }
            })
        :
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
    
    if (resp.status == 200)
        dispatch(hideConfirmationField())
    else {
        const responseBody = await resp.json()
        console.log(responseBody, resp.status)
        dispatch({
            type: ERROR_CONFIRMATION,
            payload: body.message
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

export const showConfirmationField = () => async dispatch => {
    dispatch({
        type: SHOW_CONFIRMATION_FIELD,
        payload: true
    })
}

export const hideConfirmationField = () => async dispatch => {
    dispatch({
        type: HIDE_CONFIRMATION_FIELD,
        payload: false
    })
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
        type: ERROR_SET_DEFAULT
    })
}