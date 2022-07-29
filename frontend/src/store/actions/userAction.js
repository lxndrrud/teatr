import { LOG_IN, LOG_OUT, REGISTER, ERROR_USER, ERROR_USER_SET_DEFAULT, FETCH_PERSONAL_AREA, CHANGE_PASSWORD, CHANGE_PERSONAL_INFO, SUCCESS_USER_SET_DEFAULT } from "../types";

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

export const logInAdmin = (email, password) => async dispatch =>  {
    const response = await fetch(`/expressjs/users/adminLogin`, {
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

export const successSetDefault = () => async dispatch => {
    dispatch({
        type: SUCCESS_USER_SET_DEFAULT
    })
}

export const getPersonalArea = (token) => async dispatch => {
    try {
        let response = await fetch('/expressjs/users/personalArea', {
            headers: {
                'auth-token': token
            }
        })
    
        let respBody = await response.json()
        if (response.status === 200) 
            dispatch({
                type: FETCH_PERSONAL_AREA,
                payload: respBody
            })
        else throw respBody.message
    } catch(e) {
        dispatch({
            type: ERROR_USER,
            payload: e 
        })
    }
}

export const changePassword = (token, passwordInfo) => async dispatch => {
    try {
        let response = await fetch('/expressjs/users/edit/password', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify(passwordInfo)
        })

        if (response.status === 200) 
            dispatch({
                type: CHANGE_PASSWORD,
                success_message: "Пароль успешно обновлён!"
            })
        else {
            let respBody = await response.json()
            throw respBody.message
        }

    } catch(e) {
        dispatch({
            type: ERROR_USER,
            payload: e
        })
    }
}

export const changePersonalInfo = (token, personalInfo) => async dispatch => {
    try {  
        const response = await fetch('/expressjs/users/edit/personal', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify(personalInfo)
        })
        
        if (response.status === 200) 
            dispatch({
                type: CHANGE_PERSONAL_INFO,
                success_message: "Личная информация обновлена!"
            })
        else {
            let respBody = await response.json()
            throw respBody.message
        }
    } catch(e) {
        dispatch({
            type: ERROR_USER,
            payload: e
        })
    }
}