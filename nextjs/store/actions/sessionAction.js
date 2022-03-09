import { FETCH_FILTERED_SESSIONS, FETCH_SESSION, FETCH_SESSIONS, FETCH_SESSIONS_BY_PLAY, FETCH_SESSION_FILTER_OPTIONS, FETCH_SLOTS } from '../types'



export const fetchSession = (sessionid) => async dispatch =>  {
    const response = await fetch(`/expressjs/sessions/${sessionid}`)
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
    const resp = await fetch(`/expressjs/sessions/play/${playid}`)
    const json_ = await resp.json()
    dispatch({
        type: FETCH_SESSIONS_BY_PLAY,
        payload: json_
    })
}

export const fetchSlotsBySession = (sessionid) => async dispatch => {
    const resp = await fetch(`/expressjs/sessions/${sessionid}/slots`)
    const json_ = await resp.json()
    dispatch({
        type: FETCH_SLOTS,
        payload: json_
    })
}

export const fetchSessionFilterOptions = () => async dispatch => {
    const resp = await fetch('/expressjs/sessions/filterSetup')
    const json_ = await resp.json()

    dispatch({
        type: FETCH_SESSION_FILTER_OPTIONS,
        payload: json_
    })
}


export const fetchFilteredSessions = (date, auditoriumTitle, playTitle) => async dispatch => {
    const resp = await fetch('/expressjs/sessions/filter?' + new URLSearchParams({
            'date': date,
            'auditorium_title': auditoriumTitle,
            'play_title': playTitle
        }), 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET',
    })
    const json_ = await resp.json()

    dispatch({
        type: FETCH_FILTERED_SESSIONS,
        payload: json_
    })
}