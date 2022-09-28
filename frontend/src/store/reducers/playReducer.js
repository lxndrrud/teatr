import { CLEAR_SUCCESS_ERROR_PLAY, ERROR_PLAY, FETCH_PLAY, FETCH_PLAYS, SUCCESS_PLAY } from "../types"


const defaultState = {
    play: {},
    plays: [],
    loading: false,
    error: null,
    success: null,
}

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

}

export default playReducer