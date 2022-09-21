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

/* До event sourcing`а, теперь long polling  */
export const fetchSlotsBySession = (token, idSession) => async dispatch => {
    const response = await fetch(`/expressjs/sessions/${idSession}/slots`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token
        }
    })
    if (response.status === 200) {
        const json_ = await response.json()
        dispatch({
            type: FETCH_SLOTS,
            payload: json_
        })
    }
}

export const fetchSlots = (slotsInfo) => async dispatch => {
    dispatch({
        type: FETCH_SLOTS,
        payload: slotsInfo
    })
}
/*
export const fetchSlotsBySession = (token, idSession) => async dispatch => {
    try {
        console.log('kek')
        const eventSource = new EventSource(`/expressjs/sessions/${idSession}/slots`)
        console.log(eventSource.readyState)
        eventSource.onopen = function(event) {
            console.log("opened!")
        }
        eventSource.onmessage = function(event) {
            console.log("kekekke", event.data )
            dispatch({
                type: FETCH_SLOTS,
                payload: event.data
            })
        }
        eventSource.onerror = function(event) {
            console.log('errror')
        }
        console.log(eventSource.readyState)

    } catch(e) {
        console.log(e)
    }
    
}
*/

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
            'dateFrom': date,
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

export const createSessionsCSV = (token, file) => async dispatch => {
    const formData = new FormData()
    formData.append('csv', file)
    const response = await fetch('/expressjs/sessions/csv', {
        headers: {
            //'Content-Type': 'multipart/form-data',
            'auth-token': token
        },
        method: "POST",
        body: formData
    })

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
            payload: "Сеансы успешно загружены!"
        })
    }
}

export const clearSuccessErrorSession = () => async dispatch => {
    dispatch({
        type: CLEAR_SUCCESS_ERROR_SESSION
    })
}