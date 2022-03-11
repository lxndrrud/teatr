import { useDispatch, useSelector } from 'react-redux'
import { showConfirmationField, postReservation } from '../../store/actions/reservationAction'
import { fetchSlotsBySession } from "../../store/actions/sessionAction"
import CustomInput from '../CustomInput/CustomInput'
import CustomButton from '../CustomButton/CustomButton'
import SlotsFieldMainAuditorium from "../SlotsFieldMainAuditorium/SlotsFieldMainAuditorium"
import React, { useEffect } from 'react'
import { useState } from 'react'
import store  from "../../store/store"

const getSlots = () => {
    return store.getState().reservation.slots
}

const ReservationPostForm = ({ session }) => {
    const dispatch = useDispatch()
    let errorReservation = useSelector(state => state.reservation.error)

    let [email, setEmail] = useState('')

    let [emailErrorMessage, setEmailErrorMessage] = useState()

    const syncEmail = (e) => {
        setEmail(e.target.value)
    }

    const emailError = (text) => {
        setEmailErrorMessage(text)
        setEmail('')
    }

    useEffect(() => {
        if (session.id)
            dispatch(fetchSlotsBySession(session.id))
    }, [session])

    let slots = useSelector(state => state.session.slots)

    useEffect(() => {
        emailError(errorReservation)
    }, [errorReservation])

    const postEmailReservation = (e) => {
        e.preventDefault()

        if (email === '') {
            emailError('Пожалуйста, введите почту и попробуйте еще раз.')
            return 
        }

        // Отправить на backend запрос по почте
        dispatch(postReservation({
            email: email, 
            id_session: session.id,
            slots: getSlots()
        }))

        if (errorReservation === null) dispatch(showConfirmationField())
    }

    return (
        <>
            { session.auditorium_title === 'Главный зал' 
                ?
                    <SlotsFieldMainAuditorium rows={slots} />
                : 
                    <div></div>
            }
            <CustomInput type="email" name="email" value={email} placeholder="Ваша почта"
                onChange={syncEmail} required 
                description="На вашу почту будет выслан код подтверждения" 
                errorMessage={emailErrorMessage}/>
            <CustomButton type="submit" value="Подтвердить" onClickHook={postEmailReservation} />
        </>
    )
}

export default ReservationPostForm