import { ERROR_USER, ERROR_USER_SET_DEFAULT, FETCH_PERSONAL_AREA, LOG_IN, LOG_OUT, REGISTER } from "../types"


const defaultState = {
    token: '',
    isAdmin: null,
    user: null,
    error: null
}

const userReducer = (state=defaultState, action) => {
    switch(action.type) {
        case LOG_IN:
            return {...state, 
                token: action.payload.token, 
                isAdmin: action.payload.isAdmin ? action.payload.isAdmin : false
            }
        case LOG_OUT:
            return {...state, token: defaultState.token, isAdmin: defaultState.isAdmin}
        case REGISTER:
            return {...state, token: action.payload.token, isAdmin: false}
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