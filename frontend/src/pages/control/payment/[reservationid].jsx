import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { checkLogin } from "../../../middlewares/authFunctions"
import MainLayout from "../../../layouts/MainLayout/MainLayout"
import DialogForm from "../../../components/Forms/DialogForm/DialogForm"
import { paymentStatusReservation } from '../../../store/actions/reservationAction'
import { useNavigate, useParams } from 'react-router-dom'

function PaymentReservationPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const store = useStore()

    const { idReservation } = useParams()
    let [error, setError] = useState(null)


    useEffect(() => {
        if(!checkLogin(store)) {
            navigate('/login')
            return
        }
    }, [store, navigate])

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
                navigate('/control')
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