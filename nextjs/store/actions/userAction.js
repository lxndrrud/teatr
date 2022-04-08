import { LOG_IN, LOG_OUT, REGISTER, ERROR_USER, ERROR_USER_SET_DEFAULT } from "../types";

export const register = (email, password, 
firstname=undefined, middlename=undefined, lastname=undefined) => async dispatch => {
    const response = await fetch(`/expressjs/users`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
            firstname,
            middlename,
            lastname
        })
    })
    const json_ = await response.json()

    if (response.status === 201)
        dispatch({
            type: REGISTER,
            payload: json_
        })
    else 
        dispatch({
            type: ERROR_USER,
            payload: json_.message
        })
}

export const logIn = (email, password) => async dispatch =>  {
    const response = await fetch(`/expressjs/users/login`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    })
    const json_ = await response.json()

    if (response.status === 200)
        dispatch({
            type: LOG_IN,
            payload: json_
        })
    else 
        dispatch({
            type: ERROR_USER,
            payload: json_.message
        })

}

export const logOut = () => async dispatch => {
    dispatch({
        type: LOG_OUT
    })
}

export const errorSetDefault = () => async dispatch => {
    dispatch({
        type: ERROR_USER_SET_DEFAULT
    })
}