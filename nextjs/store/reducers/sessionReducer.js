import { FETCH_SESSION, FETCH_SESSIONS } from "../types"


const defaultState = {
    session: {
        id: 0,
        play_title: '',
        datetime: '2022-02-13T10:30:00',
        auditorium_title: ''
    },
    sessions: [{
        id: 0,
        play_title: '',
        datetime: '2022-02-13T10:30:00',
        auditorium_title: ''
    }],
    loading: false,
    error: null
}

const sessionReducer = (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_SESSION:
            return {...state, session: action.payload }
        case FETCH_SESSIONS:
            return {...state, sessions: action.payload }
        default:
            return state
    }

}

export default sessionReducer