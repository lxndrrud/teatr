import React, { useEffect, useState } from 'react'
import MainLayout from "../../../layouts/MainLayout/MainLayout"
import DialogForm from '../../../components/Forms/DialogForm/DialogForm'
import { deleteReservation, errorSetDefault } from "../../../store/actions/reservationAction"
import { useDispatch, useSelector, useStore } from "react-redux"
import { checkLogin } from '../../../middlewares/authFunctions'
import { useNavigate, useParams } from 'react-router-dom'


function DeleteReservationPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const store = useStore()

    const { idReservation }  = useParams()
    let [error, setError] = useState(null)


    useEffect(() => {
        if(!checkLogin(store)) {
            navigate('/login')
            return
        }
    }, [])

    const deleteHook = (e) => {
        e.preventDefault()
        
        const token = store.getState().user.token
        dispatch(deleteReservation({
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
        <MainLayout title="Удаление брони">
            <DialogForm text={`Вы уверены, что хотите удалить бронь #${idReservation}?`} 
                onClickHook={deleteHook} error={error} buttonType="delete" />
        </MainLayout>
    )
}

export default DeleteReservationPage