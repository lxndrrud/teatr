import { 
    SET_RESERVATION, 
    FETCH_RESERVATION ,
    POST_RESERVATION,
    ERROR_RESERVATION,
    ADD_SLOT,
    DELETE_SLOT,
    ERROR_CONFIRMATION,
    ERROR_RESERVATION_SET_DEFAULT,
    FETCH_RESERVATIONS,
    DELETE_RESERVATION,
    CLEAR_SLOTS
} from "../types"


const defaultState = {
    /*
    {
        id: 0,
        confirmation_code: '',
        id_session: 0
    }
    */
    reservation: undefined,
    reservations: [],
    need_confirmation: true,
    slots: [],
    loading: false,
    filterOptions: {},
    error: null,
}

const reservationReducer = (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_RESERVATIONS:
            return {...state, reservations: action.payload }
        case FETCH_RESERVATION:
            return {...state, reservation: action.payload }
        case POST_RESERVATION:
            return {
                ...state, 
                reservation: {
                    id: action.payload.id,
                    id_session: action.payload.id_session
                }, 
                slots: defaultState.slots,
                need_confirmation: action.payload.need_confirmation 
            }
        case SET_RESERVATION:
            return {...state, reservation: action.payload }
        case ERROR_RESERVATION:
            return {...state, error: action.payload }
        case ERROR_CONFIRMATION:
            return {...state, error: action.payload }
        case ERROR_RESERVATION_SET_DEFAULT:
            return {...state, error: defaultState.error }
        case ADD_SLOT:
            return {...state, slots: [...state.slots, action.payload ] }
        case DELETE_SLOT:
            return {...state, slots: state.slots.filter(slot => slot.id != action.payload.id) }
        case CLEAR_SLOTS:
            return {...state, slots: defaultState.slots}
        case DELETE_RESERVATION:
            console.log(action.payload)
            return {...state, reservations: state.reservations
                .filter(reservation => reservation.id != action.payload.id) 
            }
        default:
            return state
    }

}

export default reservationReducer