import { FETCH_SESSION, FETCH_SESSIONS } from '../types'



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