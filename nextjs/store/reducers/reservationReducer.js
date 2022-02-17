import { 
    SET_RESERVATION, 
    FETCH_RESERVATION ,
    SHOW_CONFIRMATION_FIELD,
    HIDE_CONFIRMATION_FIELD,
    POST_RESERVATION,
    ERROR_RESERVATION
} from "../types"


const defaultState = {
    reservation: {
        id: 0,
        code: '',
        confirmation_code: '',
        id_session: 0
    },
    reservations: [{
        id: 0,
        code: '',
        confirmation_code: '',
        id_session: 0
    }],
    loading: false,
    error: null,
    showConfirmationField: false
}

const reservationReducer = (state = defaultState, action) => {
    switch (action.type) {
        case POST_RESERVATION:
            return {...state, reservation: action.payload}
        case SET_RESERVATION:
            return {...state, reservation: action.payload }
        case SHOW_CONFIRMATION_FIELD:
            return {...state, showConfirmationField: action.payload }
        case HIDE_CONFIRMATION_FIELD:
            return {...state, showConfirmationField: action.payload }
        case ERROR_RESERVATION:
            return {...state, error: action.payload }
        default:
            return state
    }

}

export default reservationReducer