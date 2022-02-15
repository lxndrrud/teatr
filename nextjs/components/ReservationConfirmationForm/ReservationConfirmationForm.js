import React from 'react'
import CustomInput from '../CustomInput/CustomInput'
import CustomButton from '../CustomButton/CustomButton'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'

const ReservationConfirmationForm = () => {
    const dispatch = useDispatch()
    let [confirmationCode, setConfirmationCode] = useState('')
    let [confirmationErrorMessage, setConfirmationErrorMessage] = useState('')

    let reservation = useSelector(state => state.reservation.reservation)

    const syncConfirmationCode = (e) => {
        setConfirmationCode(e.target.value)
    }
    const postConfirmation = (e) => {
        e.preventDefault()

        const errorConfirmation = (statusCode) => {
            if (statusCode == 412) {
                setConfirmationErrorMessage('Вы ввели неверный код подтверждения! Попробуйте еще раз.')
                setConfirmationCode('')
            }
            else if (statusCode == 404) {
                setConfirmationErrorMessage('Ваша бронь не найдена! Создайте бронь заново.')
                setConfirmationCode('')
            }
        }

        const postConfirmationRequest = async () => {
            // send request and redirect 
            let body = {
                confirmation_code: confirmationCode,
                code: reservation.code,
                id_session: parseInt(reservation.id_session)
            }
            let url = '/fastapi/reservations/confirm/' + reservation.id.toString()
            let resp = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, 
                method: 'PUT', 
                body: JSON.stringify(body)
            })
            resp.status == 200 ? NextResponse.redirect('/') : errorConfirmation(resp.status)
        }
        postConfirmationRequest()
    }
    return (
        <>
            <h3>{confirmationErrorMessage}</h3>
            <CustomInput type="text" name="confirmationCode" value={confirmationCode} placeholder="Код подтверждения"
                onChange={syncConfirmationCode} description="Введите код подтверждения, который вы получили по почте" />
            <CustomButton type="submit" value="Подтвердить" onClickHook={postConfirmation} />
        </> 
    )   
}

export default ReservationConfirmationForm