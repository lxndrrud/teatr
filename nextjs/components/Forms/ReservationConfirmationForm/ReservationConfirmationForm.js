import React from 'react'
import { useRouter } from "next/router"
import CustomInput from '../../CustomInput/CustomInput'
import CustomButton from '../../CustomButton/CustomButton'
import { confirmReservation, errorSetDefault, hideConfirmationField } from "../../../store/actions/reservationAction"
import { useDispatch, useSelector, useStore } from 'react-redux'
import { useState } from 'react'

const ReservationConfirmationForm = () => {
    const router = useRouter()
    const store = useStore()
    const token = useSelector(state => state.user.token)
    const dispatch = useDispatch()
    let [confirmationCode, setConfirmationCode] = useState('')
    let [confirmationErrorMessage, setConfirmationErrorMessage] = useState('')

    let reservation = useSelector(state => state.reservation.reservation)

    const syncConfirmationCode = (e) => {
        setConfirmationCode(e.target.value)
    }
    const postConfirmation = async (e) => {
        e.preventDefault()
        const body = {
            token, 
            id_reservation: reservation.id,
            // code: reservation.code,
            id_session: parseInt(reservation.id_session),
            confirmation_code: confirmationCode
        }

        dispatch(confirmReservation(body))
        .then(() => {
            const errorObj = store.getState().reservation.error
            if (errorObj !== null) {
                setConfirmationErrorMessage(errorObj)
                setConfirmationCode('')
                dispatch(errorSetDefault())
            } 
            else {
                router.push('/')
            }
        })
    }
    return (
        <>
            <CustomInput type="text" name="confirmationCode" value={confirmationCode} 
                placeholder="Код подтверждения"
                onChange={syncConfirmationCode} 
                description="Введите код подтверждения, который вы получили по почте" 
                errorMessage={confirmationErrorMessage} />
            <CustomButton type="submit" value="Подтвердить" onClickHook={postConfirmation} />
        </> 
    )   
}

export default ReservationConfirmationForm