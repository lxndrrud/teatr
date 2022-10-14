import { createSlice } from "@reduxjs/toolkit"
import { createPlaysCSV, fetchPlay, fetchPlays } from "../actions/playAction"


const initialState = {
    play: {},
    plays: [],
    isLoading: false,
    error: null,
    success: null,
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

export const playReducer = createSlice({
    name: 'plays',
    initialState,
    reducers: {
        clearSuccess(state, action) {
            state.success = initialState.success
        },
        clearError(state, action) {
            state.error = initialState.error
        }
    },
    extraReducers: {
        // Fetch play
        [fetchPlay.fulfilled]: (state, action) => {
            state.play = action.payload
            defaultFullfilled(state)
        }, 
        [fetchPlay.pending]: pending,
        [fetchPlay.rejected]: rejected,

         // Fetch plays
        [fetchPlays.fulfilled]: (state, action) => {
            state.plays = action.payload
            defaultFullfilled(state)
        }, 
        [fetchPlays.pending]: pending,
        [fetchPlays.rejected]: rejected,

        // Create plays CSV
        [createPlaysCSV.fulfilled]: defaultFullfilled,
        [createPlaysCSV.pending]: pending,
        [createPlaysCSV.rejected]: rejected
    }

})

/*
const playReducer = (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_PLAY:
            return {...state, play: action.payload }
        case FETCH_PLAYS:
            return {...state, plays: action.payload }
        case ERROR_PLAY:
            return {...state, error: action.payload }
        case SUCCESS_PLAY:
            return {...state, success: action.payload }
        case CLEAR_SUCCESS_ERROR_PLAY:
            return {...state, success: defaultState.success, error: defaultState.error }
        default:
            return state
    }

}*/

//export default playReducer