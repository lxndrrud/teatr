import { combineReducers } from "redux"
import playReducer from './playReducer'
import sessionReducer from "./sessionReducer"
import reservationReducer from "./reservationReducer"
import userReducer from './userReducer'
import designReducer from "./designReducer"

export default combineReducers({
    play: playReducer,
    session: sessionReducer,
    reservation: reservationReducer,
    user: userReducer,
    design: designReducer
})
