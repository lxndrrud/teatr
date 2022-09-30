//import rootReducer from "./reducers";
import thunk from 'redux-thunk'
//import { composeWithDevTools } from 'redux-devtools-extension'
//import { createStore, applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import playReducer from "./reducers/playReducer";
import sessionReducer from "./reducers/sessionReducer";
import reservationReducer from "./reducers/reservationReducer";
import userReducer from "./reducers/userReducer";
import designReducer from "./reducers/designReducer";
import { apiSlice } from "../api";

/*
const initialState = {}
const middleware = [thunk, apiSlice.middleware]
*/

const store = configureStore({
    reducer: {
        play: playReducer,
        session: sessionReducer,
        reservation: reservationReducer,
        user: userReducer,
        design: designReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
        
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(thunk, apiSlice.middleware)
})

/*
const store = createStore(rootReducer, initialState, 
    composeWithDevTools(applyMiddleware(...middleware)))
    */

export default store
