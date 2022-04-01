import { ERROR_USER, ERROR_USER_SET_DEFAULT, LOG_IN, LOG_OUT, REGISTER } from "../types"


const defaultState = {
    token: '',
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
        case ERROR_USER:
            return {...state, error: action.payload}
        case ERROR_USER_SET_DEFAULT:
            return {...state, error: defaultState.error}
        default:
            return state
    }
}

export default userReducer