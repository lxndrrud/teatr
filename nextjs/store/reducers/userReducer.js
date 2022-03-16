import { LOG_IN, LOG_OUT, REGISTER } from "../types"


const defaultState = {
    token: ''
}

const userReducer = (state=defaultState, action) => {
    switch(action.type) {
        case LOG_IN:
            return {...state, token: action.payload.token}
        case LOG_OUT:
            return {...state, token: defaultState.token}
        case REGISTER:
            return {...state, token: action.payload.token}
        default:
            return state
    }
}

export default userReducer