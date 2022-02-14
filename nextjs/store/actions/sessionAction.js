import { FETCH_SESSION, FETCH_SESSIONS, FETCH_SESSIONS_BY_PLAY } from '../types'



export const fetchSession = (playid) => async dispatch =>  {
    const response = await fetch(`/fastapi/sessions/${playid}`)
    const json_ = await response.json()
    dispatch({
        type: FETCH_SESSION,
        payload: json_
    })
}


export const fetchSessions = () => async dispatch =>  {
    const response = await fetch('/fastapi/sessions')
    const json_ = await response.json()
    dispatch({
        type: FETCH_SESSIONS,
        payload: json_
    })
}

export const fetchSessionsByPlay = (playid) => async dispatch => {
    const resp = await fetch(`/fastapi/sessions/play/${playid}`)
    const json_ = await resp.json()
    dispatch({
        type: FETCH_SESSIONS_BY_PLAY,
        payload: json_
    })
}