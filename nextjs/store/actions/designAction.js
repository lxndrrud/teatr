import { TOGGLE_NAVBAR } from "../types";

export const toggleNavbar = () => async dispatch => {
    dispatch({
        type: TOGGLE_NAVBAR
    })
}