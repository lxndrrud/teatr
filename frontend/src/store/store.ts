//import rootReducer from "./reducers";
//import thunk from 'redux-thunk'
//import { composeWithDevTools } from 'redux-devtools-extension'
//import { createStore, applyMiddleware } from "redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { playReducer } from "./reducers/playReducer";
import { sessionReducer } from "./reducers/sessionReducer";
import { reservationReducer } from "./reducers/reservationReducer";
import { userReducer } from "./reducers/userReducer";
import { designReducer } from "./reducers/designReducer";

/*
const initialState = {}
const middleware = [thunk, apiSlice.middleware]
*/


const rootReducer = combineReducers({
    play: playReducer.reducer,
    session: sessionReducer.reducer,
    reservation: reservationReducer.reducer,
    user: userReducer.reducer,
    design: designReducer.reducer,
})

/*
const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(thunk)
})
*/

/*
const store = createStore(rootReducer, initialState, 
    composeWithDevTools(applyMiddleware(...middleware)))
    */

export const setupStore = () => configureStore({
    reducer: rootReducer,
})

