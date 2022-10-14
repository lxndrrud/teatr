import React, { useEffect } from 'react'
import MainLayout from "../../../layouts/MainLayout/MainLayout"
import DialogForm from '../../../components/Forms/DialogForm/DialogForm'
import { deleteReservation } from "../../../store/actions/reservationAction"
import { useDispatch,  useStore } from "react-redux"
import { checkLogin } from '../../../middlewares/authFunctions'
import { useNavigate, useParams } from 'react-router-dom'
import { reservationReducer } from '../../../store/reducers/reservationReducer'
import swal from 'sweetalert2'


function DeleteReservationPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const store = useStore()

    const { idReservation }  = useParams()

    useEffect(() => {
        if(!checkLogin(store)) {
            navigate('/login')
            return
        }
    }, [store, navigate])

    const deleteHook = (e) => {
        e.preventDefault()
        
        const token = store.getState().user.token
        dispatch(deleteReservation({
            token, 
            idReservation
        }))
        .then(() => {
            const errorFromStore = store.getState().reservation.error
            if (errorFromStore !== null) {
                swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorFromStore,
                    icon: "error"
                })
                dispatch(reservationReducer.actions.clearError())
            }
            else {
                swal.fire({
                    title: 'Бронь удалена!',
                    icon: "success",
                    timer: 2000
                })
                setTimeout(navigate('/control'), 2100)
            }
        })
    }

    return (
        <MainLayout title="Удаление брони">
            <DialogForm text={`Вы уверены, что хотите удалить бронь #${idReservation}?`} 
                onClickHook={deleteHook} buttonType="delete" />
        </MainLayout>
    )
}

export default DeleteReservationPage