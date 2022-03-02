import { 
    SET_RESERVATION, 
    FETCH_RESERVATION ,
    SHOW_CONFIRMATION_FIELD,
    HIDE_CONFIRMATION_FIELD,
    POST_RESERVATION,
    ERROR_RESERVATION,
    ADD_SLOT,
    DELETE_SLOT
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
    slots: [],
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
        case ADD_SLOT:
            console.log(state, action.payload)
            return {...state, slots: [...state.slots, action.payload ]}
        case DELETE_SLOT:
            console.log(state, action.payload)
            return {...state, slots: state.slots.filter(slot => slot.id != action.payload.id)}
        default:
            return state
    }

}

export default reservationReducer