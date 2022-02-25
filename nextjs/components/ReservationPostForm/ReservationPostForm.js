import { useDispatch, useSelector } from 'react-redux'
import { showConfirmationField, postReservation } from '../../store/actions/reservationAction'
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
            <SlotsFieldMainAuditorium rows={[ 
                { number: 1, seats: [
                    {is_reserved: false, row_number: 1, seat_number: 1, price: 200.0, id: 1}, 
                    {is_reserved: false, row_number: 1, seat_number: 2, price: 200.0, id: 2}, 
                    {is_reserved: false, row_number: 1, seat_number: 3, price: 200.0, id: 3}, 
                    {is_reserved: false, row_number: 1, seat_number: 4, price: 200.0, id: 4}, 
                    {is_reserved: false, row_number: 1, seat_number: 5, price: 200.0, id: 5}, 
                    {is_reserved: false, row_number: 1, seat_number: 6, price: 200.0, id: 6}, 
                    {is_reserved: false, row_number: 1, seat_number: 7, price: 200.0, id: 7}, 
                    {is_reserved: false, row_number: 1, seat_number: 8, price: 200.0, id: 8}, 
                    {is_reserved: true, row_number: 1, seat_number: 9, price: 200.0, id: 9}, 
                    {is_reserved: false, row_number: 1, seat_number: 10, price: 200.0, id: 10}, 
                    {is_reserved: false, row_number: 1, seat_number: 11, price: 200.0, id: 11}, 
                    {is_reserved: false, row_number: 1, seat_number: 12, price: 200.0, id: 12}, 
                    {is_reserved: true, row_number: 1, seat_number: 13, price: 200.0, id: 13}, 
                    {is_reserved: false, row_number: 1, seat_number: 14, price: 200.0, id: 14}, 
                    {is_reserved: false, row_number: 1, seat_number: 15, price: 200.0, id: 15}, 
                    {is_reserved: false, row_number: 1, seat_number: 16, price: 200.0, id: 16}, 
                    ] 
                }
            ]} />
            <CustomInput type="email" name="email" value={email} placeholder="Ваша почта"
                onChange={syncEmail} required 
                description="На вашу почту будет выслан код подтверждения" 
                errorMessage={emailErrorMessage}/>
            <CustomButton type="submit" value="Подтвердить" onClickHook={postEmailReservation} />
        </>
    )
}

export default ReservationPostForm