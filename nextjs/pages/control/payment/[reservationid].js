import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { checkLogin } from "../../../middlewares/auth"
import { useRouter } from 'next/router'
import MainLayout from "../../../layouts/MainLayout/MainLayout"
import DialogForm from "../../../components/Forms/DialogForm/DialogForm"
import { paymentStatusReservation } from '../../../store/actions/reservationAction'

const PaymentReservationPage = () => {
    const dispatch = useDispatch()
    const store = useStore()
    const router = useRouter()

    const idReservation = router.query.reservationid
    let [error, setError] = useState('')


    useEffect(() => {
        if(!checkLogin(store)) {
            if (router.isReady) router.push('/login')
        }
    })

    const paymentHook = (e) => {
        e.preventDefault()
        
        const token = store.getState().user.token
        dispatch(paymentStatusReservation({
            token, 
            id_reservation: idReservation
        }))
        .then(() => {
            const errorFromStore = store.getState().reservation.error
            if (errorFromStore !== null) {
                setError(errorFromStore)
                dispatch(errorSetDefault())
            }
            else {
                if (router.isReady) {
                    router.push('/control')
                }
            }
        })
    }
    return (
        <MainLayout title="Изменение статуса оплаты">
            <DialogForm text={`Вы уверены, что хотите изменить статус оплаты брони #${idReservation}?`} 
                onClickHook={paymentHook} error={error} buttonType="submit" />
        </MainLayout>
    )
}

export default PaymentReservationPage