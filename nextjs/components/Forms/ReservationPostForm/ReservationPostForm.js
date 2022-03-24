import { useDispatch, useSelector, useStore } from 'react-redux'
import { showConfirmationField, postReservation, errorSetDefault } from '../../../store/actions/reservationAction'
import { fetchSlotsBySession } from "../../../store/actions/sessionAction"
import CustomButton from '../../UI/CustomButton/CustomButton'
import SlotsFieldMainAuditorium from "../../Slots/SlotsFieldMainAuditorium/SlotsFieldMainAuditorium"
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router"
import styles from "./ReservationPostForm.module.css"


const ReservationPostForm = ({ session }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const store = useStore()
    let [error, setError] = useState()

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
        .then(() => {
            const errorObj = store.getState().reservation.error
            const needConfirmation = store.getState().reservation.need_confirmation
            if (errorObj !== null) {
                setError(errorObj)
                dispatch(errorSetDefault())
            } else if (needConfirmation) {
                dispatch(showConfirmationField())
            }
            else {
                if (router.isReady) {
                    router.push('/control')
                }
            }
        })

        //if (errorReservation === null) dispatch(showConfirmationField())
    }

    return (
        <>
            { session.auditorium_title === 'Главный зал' 
                ?
                    <SlotsFieldMainAuditorium rows={slots} />
                : 
                    <div></div>
            }
            <div className={styles.errorMessage}>{error}</div>
            <CustomButton type="submit" value="Подтвердить" onClickHook={postEmailReservation} />
        </>
    )
}

export default ReservationPostForm