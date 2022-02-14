import { useDispatch, useSelector } from 'react-redux'
import { showConfirmationField, setReservation } from '../../store/actions/reservationAction'
import React from 'react'
import { useState } from 'react'

const ReservationPostForm = ({ session }) => {
    const dispatch = useDispatch()

    

    let [email, setEmail] = useState('')
    let [slotsList, setSlotsList] = useState([1])
    let [emailErrorMessage, setEmailErrorMessage] = useState('')

    const syncEmail = (e) => {
        setEmail(e.target.value)
    }

    const postEmailReservation = (e) => {
        e.preventDefault()
        const emailErrorMessage = () => {
            setEmail('')
            setEmailErrorMessage('Произошла ошибка! Попробуйте еще раз.')
        }
        const success = (responseBody) => {
            // Нужно связать все компоненты формы
            // setShowConfirmationField(true)
            dispatch(setReservation({
                id: responseBody.id,
                id_session: responseBody.id_session,
                code: responseBody.code,
            }))
            dispatch(showConfirmationField())
        }
        // Отправить на backend запрос по почте
        const postReservation = async () => {
            let body = {
                email: email, 
                id_session: session.id,
                slots: slotsList
            }
            let resp = await fetch('/fastapi/reservations', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, 
                method: 'POST', 
                body: JSON.stringify(body)
            })
            body = await resp.json()
            resp.status == 201 ?  success(body) : emailErrorMessage()
        }
        postReservation()
    }

    return (
        <>
            <h3>{emailErrorMessage}</h3>
            <input type="email" name="email" value={email} placeholder="Ваша почта"
                onChange={syncEmail} required />
            <input type="submit" value="Подтвердить" onClick={postEmailReservation}/>
        </>
    )
}

export default ReservationPostForm