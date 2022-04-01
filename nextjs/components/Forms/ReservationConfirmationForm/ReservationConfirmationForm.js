import React from 'react'
import { useRouter } from "next/router"
import CustomInput from '../../UI/CustomInput/CustomInput'
import CustomButton from '../../UI/CustomButton/CustomButton'
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'
import { confirmReservation, errorSetDefault, hideConfirmationField } from "../../../store/actions/reservationAction"
import { useDispatch, useSelector, useStore } from 'react-redux'
import { useState } from 'react'

const ReservationConfirmationForm = () => {
    const router = useRouter()
    const store = useStore()
    const dispatch = useDispatch()
    let token = useSelector(state => state.user.token)
    let errorFromStore = useSelector(state => state.reservation.error)

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
            id_reservation: parseInt(reservation.id),
            id_session: parseInt(reservation.id_session),
            confirmation_code: confirmationCode
        }

        dispatch(confirmReservation(body))
        .then(() => {
            if (errorFromStore !== null) {
                setConfirmationErrorMessage(errorFromStore)
                setConfirmationCode('')
                dispatch(errorSetDefault())
            } 
            else {
                router.push('/control')
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
            {
                confirmationErrorMessage !== ''
                ? <ErrorMessage text={confirmationErrorMessage} />
                : null
            }
            <CustomButton type="submit" value="Подтвердить" onClickHook={postConfirmation} />
        </> 
    )   
}

export default ReservationConfirmationForm