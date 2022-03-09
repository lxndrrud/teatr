import { FETCH_PLAY, FETCH_PLAYS } from '../types'



export const fetchPlay = (playid) => async dispatch =>  {
    const response = await fetch(`/expressjs/plays/${playid}`)
    const json_ = await response.json()
    dispatch({
        type: FETCH_PLAY,
        payload: json_
    })
}


export const fetchPlays = () => async dispatch =>  {
    const response = await fetch('/expressjs/plays')
    const json_ = await response.json()
    dispatch({
        type: FETCH_PLAYS,
        payload: json_
    })
}