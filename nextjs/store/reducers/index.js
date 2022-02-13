import { combineReducers } from "redux"
import playReducer from './playReducer'
import sessionReducer from "./sessionReducer"

export default combineReducers({
    play: playReducer,
    session: sessionReducer
})
