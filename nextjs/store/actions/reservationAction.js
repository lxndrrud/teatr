import { 
    SET_RESERVATION, 
    SHOW_CONFIRMATION_FIELD, 
    HIDE_CONFIRMATION_FIELD 
} from "../types"


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