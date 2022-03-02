import { FETCH_FILTERED_SESSIONS, FETCH_SESSION, FETCH_SESSIONS, FETCH_SESSIONS_BY_PLAY, FETCH_SESSION_FILTER_OPTIONS, FETCH_SLOTS } from "../types"


const defaultState = {
    session: {
        id: 0,
        play_title: '',
        date: '2022-02-13',
        time: '10:30:00',
        auditorium_title: ''
    },
    sessions: [{
        id: 0,
        play_title: 'Test',
        date: '2022-02-13',
        time: '10:30:00',
        auditorium_title: ''
    }],
    slots: [],
    filterOptions: {},
    loading: false,
    error: null
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
        default:
            return state
    }

}

export default sessionReducer