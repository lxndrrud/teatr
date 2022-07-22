import { ERROR_USER, ERROR_USER_SET_DEFAULT, FETCH_PERSONAL_AREA, LOG_IN, LOG_OUT, REGISTER } from "../types"


const defaultState = {
    token: '',
    user: null,
    error: null
}

const userReducer = (state=defaultState, action) => {
    switch(action.type) {
        case LOG_IN:
            return {...state, token: action.payload.token}
        case LOG_OUT:
            return {...state, token: defaultState.token}
        case REGISTER:
            return {...state, token: action.payload.token}
        case FETCH_PERSONAL_AREA:
            return {...state, user: action.payload.user }
        case ERROR_USER:
            return {...state, error: action.payload}
        case ERROR_USER_SET_DEFAULT:
            return {...state, error: defaultState.error}
        default:
            return state
    }
}

export default userReducer