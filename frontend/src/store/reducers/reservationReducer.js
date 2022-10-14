import { createSlice } from "@reduxjs/toolkit"
import { changePaymentStatus, confirmReservation, createReservation, deleteReservation, fetchFilteredReservations, fetchReservation, fetchReservationFilterOptions, fetchReservations } from "../actions/reservationAction"
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
    CLEAR_SLOTS,
    FETCH_RESERVATION_FILTER_OPTIONS,
    FETCH_FILTERED_RESERVATIONS,
    PAYMENT_RESERVATION
} from "../types"


const initialState = {
    reservation: {},
    reservations: [],
    need_confirmation: true,
    slots: [],
    isLoading: false,
    filterOptions: {},
    error: null,
}

const pending = (state) => {
    state.isLoading = true
}

const rejected = (state, action) =>  {
    state.isLoading = false
    if (action) state.error = action.error.message
}

const defaultFullfilled = (state) => {
    rejected(state)
}


export const reservationReducer = createSlice({
    name: "reservations",
    initialState,
    reducers: {
        addSlot(state, action) {
            state.slots.push({
                seat_number: action.payload.seat_number,
                row_number: action.payload.row_number,
                price: action.payload.price,
                id: action.payload.id
            })
        },
        deleteSlot(state, action) {
            state.slots = state.slots.filter(slot => slot.id != action.payload.id)
        },
        clearSlots(state, action) {
            state.slots = initialState.slots
        },
        clearError(state, action) {
            state.error = initialState.error
        }
    },
    extraReducers: {
        [fetchReservation.fulfilled]: (state, action) => {
            state.reservation = action.payload
            defaultFullfilled(state)
        },
        [fetchReservation.pending]: pending,
        [fetchReservation.rejected]: rejected,

        [fetchReservations.fulfilled]: (state, action) => {
            state.reservations = action.payload
            defaultFullfilled(state)
        },
        [fetchReservations.pending]: pending,
        [fetchReservations.rejected]: rejected,

        [createReservation.fulfilled]: (state, action) => {
            state.reservation = {
                id: action.payload.id,
                id_session: action.payload.id_session
            }
            state.slots = initialState.slots
            state.need_confirmation = action.payload.need_confirmation
            defaultFullfilled(state)
        },
        [createReservation.pending]: pending,
        [createReservation.rejected]: rejected,

        [deleteReservation.fulfilled]: defaultFullfilled,
        [deleteReservation.pending]: pending,
        [deleteReservation.rejected]: rejected,

        [confirmReservation.fulfilled]: defaultFullfilled,
        [confirmReservation.pending]: pending,
        [confirmReservation.rejected]: rejected,

        [changePaymentStatus.fulfilled]: defaultFullfilled,
        [changePaymentStatus.pending]: pending,
        [changePaymentStatus.rejected]: rejected,

        [fetchReservationFilterOptions.fulfilled]: (state, action) => {
            state.filterOptions = action.payload
            defaultFullfilled(state)
        },
        [fetchReservationFilterOptions.pending]: pending,
        [fetchReservationFilterOptions.rejected]: rejected,

        [fetchFilteredReservations.fulfilled]: (state, action) => {
            state.reservations = action.payload
            defaultFullfilled(state)
        },
        [fetchFilteredReservations.pending]: pending,
        [fetchFilteredReservations.rejected]: rejected,


    }
})

/*
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
        case PAYMENT_RESERVATION:
            return { ...state }
        case DELETE_RESERVATION:
            return {...state, reservations: state.reservations
                .filter(reservation => reservation.id != action.payload.id) 
            }
        case FETCH_RESERVATION_FILTER_OPTIONS:
            return {...state, filterOptions: action.payload }
        case FETCH_FILTERED_RESERVATIONS:
            return {...state, reservations: action.payload }
        default:
            return state
    }

}

export default reservationReducer
*/
