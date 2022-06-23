import { CLEAR_SUCCESS_ERROR_SESSION, ERROR_SESSION, FETCH_FILTERED_SESSIONS, FETCH_SESSION, FETCH_SESSIONS, FETCH_SESSIONS_BY_PLAY, FETCH_SESSION_FILTER_OPTIONS, FETCH_SLOTS, SUCCESS_SESSION } from "../types"


const defaultState = {
    /*
    {
        id: 0,
        play_title: 'Test',
        timestamp: '2022-03-09T00:00:00',
        max_slots: 0,
        auditorium_title: ''
    }
    */
    session: {},
    sessions: [],
    slots: [],
    filterOptions: {},
    loading: false,
    error: null,
    success: null,
}

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
        case CLEAR_SUCCESS_ERROR_SESSION: {
            return {...state, success: defaultState.success, error: defaultState.error}
        }
        default:
            return state
    }

}

export default sessionReducer