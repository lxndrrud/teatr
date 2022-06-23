import { CLEAR_SUCCESS_ERROR_SESSION, ERROR_SESSION, FETCH_FILTERED_SESSIONS, FETCH_SESSION, FETCH_SESSIONS, 
    FETCH_SESSIONS_BY_PLAY, FETCH_SESSION_FILTER_OPTIONS, FETCH_SLOTS, SUCCESS_SESSION } from '../types'



export const fetchSession = (token, sessionid) => async dispatch =>  {
    const response = await fetch(`/expressjs/sessions/${sessionid}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token
        }
    })
    const json_ = await response.json()
    dispatch({
        type: FETCH_SESSION,
        payload: json_
    })
}


export const fetchSessions = () => async dispatch =>  {
    const response = await fetch('/expressjs/sessions')
    const json_ = await response.json()
    dispatch({
        type: FETCH_SESSIONS,
        payload: json_
    })
}

export const fetchSessionsByPlay = (playid) => async dispatch => {
    const response = await fetch(`/expressjs/sessions/play/${playid}`)
    const json_ = await response.json()
    dispatch({
        type: FETCH_SESSIONS_BY_PLAY,
        payload: json_
    })
}

export const fetchSlotsBySession = (token, sessionid) => async dispatch => {
    const response = await fetch(`/expressjs/sessions/${sessionid}/slots`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token
        }
    })
    const json_ = await response.json()
    dispatch({
        type: FETCH_SLOTS,
        payload: json_
    })
}

export const fetchSessionFilterOptions = () => async dispatch => {
    const response = await fetch('/expressjs/sessions/filter/setup')
    const json_ = await response.json()

    dispatch({
        type: FETCH_SESSION_FILTER_OPTIONS,
        payload: json_
    })
}


export const fetchFilteredSessions = (date, auditoriumTitle, playTitle) => async dispatch => {
    const response = await fetch('/expressjs/sessions/filter?' + new URLSearchParams({
            'date': date,
            'auditorium_title': auditoriumTitle,
            'play_title': playTitle
        }), 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'GET',
    })

    if (response.status === 200) {
        const json_ = await response.json()

        dispatch({
            type: FETCH_FILTERED_SESSIONS,
            payload: json_
        })
    }
}

export const createSessionsCSV = (file) => async dispatch => {
    const formData = new FormData()
    formData.append('csv', file)
    const response = await fetch('/expressjs/sessions/csv', {
        /*headers: {
            'Content-Type': 'multipart/form-data',
        },*/
        method: "POST",
        body: formData
    })
    console.log(response.status)

    if (response.status !== 201 ) {
        let body = await response.json()
        dispatch({
            type: ERROR_SESSION,
            payload: body.message
        })
    }
    else {
        dispatch({
            type: SUCCESS_SESSION,
            payload: "Спектакли успешно загружены!"
        })
    }
}

export const clearSuccessErrorSession = () => async dispatch => {
    dispatch({
        type: CLEAR_SUCCESS_ERROR_SESSION
    })
}