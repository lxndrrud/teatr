import React, { useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { checkLogin } from "../../../middlewares/authFunctions"
import MainLayout from "../../../layouts/MainLayout/MainLayout"
import DialogForm from "../../../components/Forms/DialogForm/DialogForm"
import { changePaymentStatus } from '../../../store/actions/reservationAction'
import { useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert2'
import { reservationReducer } from '../../../store/reducers/reservationReducer'

function PaymentReservationPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const store = useStore()

    const { idReservation } = useParams()

    useEffect(() => {
        if(!checkLogin(store)) {
            navigate('/login')
            return
        }
    }, [store, navigate])

    const paymentHook = (e) => {
        e.preventDefault()
        
        const token = store.getState().user.token
        dispatch(changePaymentStatus({
            token, 
            idReservation
        }))
        .then(() => {
            const errorReservation = store.getState().reservation.error
            if (errorReservation) {
                swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorFromStore,
                    icon: "error"
                })
                dispatch(reservationReducer.actions.clearError())
                return
            }
            swal.fire({
                title: 'Бронь оплачена!',
                icon: "success",
                timer: 3000
            })
            setTimeout(navigate('/control'), 3100) 
        })
    }
    return (
        <MainLayout title="Изменение статуса оплаты">
            <DialogForm text={`Вы уверены, что хотите изменить статус оплаты брони #${idReservation}?`} 
                onClickHook={paymentHook} buttonType="submit" />
        </MainLayout>
    )
}

export default PaymentReservationPage