import { 
    ERROR_RESERVATION,
    POST_RESERVATION,
    SET_RESERVATION, 
    SHOW_CONFIRMATION_FIELD, 
    HIDE_CONFIRMATION_FIELD 
} from "../types"

export const postReservation = ({ email, id_session, slots }) => async dispatch => {
    let body = {
        email, id_session, slots
    }
    let resp = await fetch('/fastapi/reservations', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, 
        method: 'POST', 
        body: JSON.stringify(body)
    })
    body = await resp.json()
    console.log(resp.status, resp.statusText, body)
    resp.status == 201 
        ? 
            dispatch({
                type: POST_RESERVATION,
                payload: body
            })
        :
            dispatch({
                type: ERROR_RESERVATION,
                payload: body.detail
            })

}


export const setReservation = (payload) => async dispatch => {
    dispatch({
        type: SET_RESERVATION,
        payload: payload
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