import styles from "./ReservationForm.module.css"
import  { NextResponse } from "next/server"
import { useState } from "react"


const ReservationForm = ({ idSession }) => {
    let [email, setEmail] = useState('')
    let [confirmationCode, setConfirmationCode] = useState('')
    let [slotsList, setSlotsList] = useState([1])
    let [showConfirmationField, setShowConfirmationField] = useState(false)
    let [emailErrorMessage, setEmailErrorMessage] = useState('')
    let [confirmationErrorMessage, setConfirmationErrorMessage] = useState('')
    let [reservation, setReservation] = useState({
        id: 0,
        code: '',
        confirmation_code: '',
        id_session: 0
    })
    const syncEmail = (e) => {
        setEmail(e.target.value)
    }
    const syncConfirmationCode = (e) => {
        setConfirmationCode(e.target.value)
    }
    const postEmailReservation = (e) => {
        e.preventDefault()
        const emailErrorMessage = () => {
            setEmail('')
            setEmailErrorMessage('Произошла ошибка! Попробуйте еще раз.')
        }
        const success = (responseBody) => {
            setShowConfirmationField(true)
            setReservation({
                id: responseBody.id,
                id_session: responseBody.id_session,
                code: responseBody.code,
                confirmation_code: responseBody.confirmation_code
            })
        }
        // Отправить на backend запрос по почте
        const postReservation = async () => {
            let body = {
                email: email, 
                id_session: idSession,
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
            <form className={styles.postForm}>
                {showConfirmationField 
                    ? 
                    (<>
                        <h3>{confirmationErrorMessage}</h3>
                        <input type="text" name="confirmationCode" value={confirmationCode} placeholder="Код подтверждения"
                            onChange={syncConfirmationCode} required />
                        <input type="submit" value="Подтвердить" onClick={postConfirmation}/>
                    </>)
                    : 
                    (<>
                        <h3>{emailErrorMessage}</h3>
                        <input type="email" name="email" value={email} placeholder="Ваша почта"
                            onChange={syncEmail} required />
                        <input type="submit" value="Подтвердить" onClick={postEmailReservation}/>
                    </>)
                }
            </form>
            <div></div>

        </>
        
    )
};

export default ReservationForm;
