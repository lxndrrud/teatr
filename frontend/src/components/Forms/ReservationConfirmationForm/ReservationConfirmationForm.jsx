import React from 'react'
import CustomInput from '../../UI/CustomInput/CustomInput'
import CustomButton from '../../UI/CustomButton/CustomButton'
import { confirmReservation } from "../../../store/actions/reservationAction"
import { useDispatch, useSelector, useStore } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert2'
import { reservationReducer } from '../../../store/reducers/reservationReducer'

function ReservationConfirmationForm() {
    const navigate = useNavigate()
    const store = useStore()
    const dispatch = useDispatch()
    let token = useSelector(state => state.user.token)

    let [confirmationCode, setConfirmationCode] = useState('')

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
            const errorFromStore = store.getState().reservation.error
            if (errorFromStore !== null) {
                swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorFromStore,
                    icon: 'error'
                })
                setConfirmationCode('')
                dispatch(reservationReducer.actions.clearError())
            } 
            else {
                swal.fire({
                    title: 'Бронь подтверждена!',
                    icon: 'success',
                    timer: 2000
                })
                setTimeout(navigate('/control'), 2100)
            }
        })
    }
    return (
        <>
            <CustomInput type="text" name="confirmationCode" value={confirmationCode} 
                placeholder="Код подтверждения"
                onChange={syncConfirmationCode} 
                description="Введите код подтверждения, который вы получили по почте" 
            />
            <CustomButton type="submit" value="Подтвердить" onClickHook={postConfirmation} />
        </> 
    )   
}

export default ReservationConfirmationForm