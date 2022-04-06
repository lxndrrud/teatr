import React from 'react'
import DialogForm from '../../../components/Forms/DialogForm/DialogForm'
import { deleteReservation } from "../../../store/actions/reservationAction"
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux"


const DeleteReservationPage = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const idReservation = router.query.reservationid

    let token = useSelector(state => state.user.token)

    const deleteHook = (e) => {
        e.preventDefault()

        dispatch(deleteReservation({
            token, 
            id_reservation: idReservation
        }))
    }

    return (
        <div>
            <DialogForm text={`Вы уверены, что хотите удалить бронь #${idReservation}`} 
                onClickHook={deleteHook}
            />
        </div>
    )
}

export default DeleteReservationPage