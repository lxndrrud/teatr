import { useDispatch, useSelector, useStore } from 'react-redux'
import { showConfirmationField, postReservation } from '../../../store/actions/reservationAction'
import { fetchSlotsBySession } from "../../../store/actions/sessionAction"
import CustomButton from '../../CustomButton/CustomButton'
import SlotsFieldMainAuditorium from "../../SlotsFieldMainAuditorium/SlotsFieldMainAuditorium"
import React, { useEffect } from 'react'


const ReservationPostForm = ({ session }) => {
    const dispatch = useDispatch()
    const store = useStore()

    let errorReservation = useSelector(state => state.reservation.error)

    useEffect(() => {
        if (session.id)
            dispatch(fetchSlotsBySession(session.id))
    }, [session])

    let slots = useSelector(state => state.session.slots)

    const postEmailReservation = (e) => {
        e.preventDefault()

        // Отправить на backend запрос по почте
        dispatch(postReservation({
            token: store.getState().user.token, 
            id_session: session.id,
            slots: store.getState().reservation.slots
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

            <CustomButton type="submit" value="Подтвердить" onClickHook={postEmailReservation} />
        </>
    )
}

export default ReservationPostForm