import { createSlice } from "@reduxjs/toolkit"
import { createSessionsCSV, fetchFilteredSessions, fetchSession, fetchSessionFilterOptions, fetchSessions, fetchSessionsByPlay, fetchSlotsBySession } from "../actions/sessionAction"

const initialState = {
    session: {},
    sessions: [],
    paginatedSessions: [],
    slots: [],
    filterOptions: {},
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

export const sessionReducer = createSlice({
    name: "sessions",
    initialState,
    reducers: {
        fetchSlots(state, action) {
            state.slots = action.payload
        },
        clearError(state, action) {
            state.error = initialState.error
        }
    },
    extraReducers: {
        [fetchSession.fulfilled]: (state, action) => {
            state.session = action.payload
            defaultFullfilled(state)
        },
        [fetchSession.pending]: pending,
        [fetchSession.rejected]: rejected,

        [fetchSessions.fulfilled]: (state, action) => {
            state.sessions = action.payload
            defaultFullfilled(state)
        },
        [fetchSessions.pending]: pending,
        [fetchSessions.rejected]: rejected,

        [fetchSessionsByPlay.fulfilled]: (state, action) => {
            state.sessions = action.payload
            defaultFullfilled(state)
        },
        [fetchSessionsByPlay.pending]: pending,
        [fetchSessionsByPlay.rejected]: rejected,

        [fetchSessionFilterOptions.fulfilled]: (state, action) => {
            state.filterOptions = action.payload
            defaultFullfilled(state)
        },
        [fetchSessionFilterOptions.pending]: pending,
        [fetchSessionFilterOptions.rejected]: rejected,
        
        [fetchFilteredSessions.fulfilled]: (state, action) => {
            state.sessions = action.payload
            defaultFullfilled(state)
        },
        [fetchFilteredSessions.pending]: pending,
        [fetchFilteredSessions.rejected]: rejected,

        [createSessionsCSV.fulfilled]: defaultFullfilled,
        [createSessionsCSV.pending]: pending,
        [createSessionsCSV.rejected]: rejected,

        [fetchSlotsBySession.fulfilled]: (state, action) => {
            state.slots = action.payload
            defaultFullfilled(state)
        },
        [fetchSlotsBySession.pending]: pending,
        [fetchSlotsBySession.rejected]: rejected 
    }
})

/*
const sessionReducer = (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_SESSION:
            return {...state, session: action.payload }
        case FETCH_SESSIONS:
            return {...state, sessions: action.payload }
        case FETCH_SESSIONS_BY_PLAY:
            return {...state, sessions: action.payload }
        case FETCH_SLOTS:
            return {...state, slots: action.payload }
        case FETCH_SESSION_FILTER_OPTIONS:
            return {...state, filterOptions: action.payload }
        case FETCH_FILTERED_SESSIONS:
            return {...state, sessions: action.payload }
        case ERROR_SESSION:
            return {...state, error: action.payload}
        case SUCCESS_SESSION:
            return {...state, success: action.payload}
        case CLEAR_SUCCESS_ERROR_SESSION: 
            return {...state, success: defaultState.success, error: defaultState.error}
        default:
            return state
    }

}

export default sessionReducer
*/
