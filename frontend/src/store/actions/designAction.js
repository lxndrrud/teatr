import { SET_IS_LOADING, TOGGLE_NAVBAR } from "../types";


export const setIsLoading = (value) => async dispatch => {
    dispatch({
        type: SET_IS_LOADING,
        value
    })
}

export const toggleNavbar = () => async dispatch => {
    dispatch({
        type: TOGGLE_NAVBAR
    })
}