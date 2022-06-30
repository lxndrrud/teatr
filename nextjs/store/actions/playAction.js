import { FETCH_PLAY, FETCH_PLAYS, ERROR_PLAY, CLEAR_SUCCESS_ERROR_PLAY, SUCCESS_PLAY } from '../types'



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

export const createPlaysCSV = (file) => async dispatch => {
    const formData = new FormData()
    formData.append('csv', file)
    const response = await fetch('/expressjs/plays/csv', {
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
            type: ERROR_PLAY,
            payload: body.message
        })
    }
    else {
        console.log('успех')
        dispatch({
            type: SUCCESS_PLAY,
            payload: "Спектакли успешно загружены!"
        })
    }
}

export const clearSuccessErrorPlay = () => async dispatch => {
    dispatch({
        type: CLEAR_SUCCESS_ERROR_PLAY
    })
}