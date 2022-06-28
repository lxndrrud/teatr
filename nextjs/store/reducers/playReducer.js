import { ERROR_PLAY, FETCH_PLAY, FETCH_PLAYS } from "../types"


const defaultState = {
    play: {
        id: 0,
        title: '',
        description: ''
    },
    plays: [{
        id: 0,
        title: '',
        description: ''
    }],
    loading: false,
    error: null
}

const playReducer = (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_PLAY:
            return {...state, play: action.payload }
        case FETCH_PLAYS:
            return {...state, plays: action.payload }
        case ERROR_PLAY:
            return {...state, error: action.payload }
        default:
            return state
    }

}

export default playReducer