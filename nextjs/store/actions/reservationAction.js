import { 
    ERROR_RESERVATION,
    POST_RESERVATION,
    SET_RESERVATION, 
    SHOW_CONFIRMATION_FIELD, 
    HIDE_CONFIRMATION_FIELD,
    ADD_SLOT,
    DELETE_SLOT
} from "../types"

export const postReservation = ({ email, id_session, slots }) => async dispatch => {
    let body = {
        email, id_session, slots
    }
    let resp = await fetch('/expressjs/reservations', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
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
                    code: body.code,
                    id_session: body.id_session
                }
            })
        :
            dispatch({
                type: ERROR_RESERVATION,
                payload: body.message
            })

}


export const setReservation = (payload) => async dispatch => {
    dispatch({
        type: SET_RESERVATION,
        payload: {
            id: payload.id,
            code: payload.code,
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