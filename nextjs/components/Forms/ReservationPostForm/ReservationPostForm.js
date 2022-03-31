import { useDispatch, useSelector, useStore } from 'react-redux'
import { postReservation, errorSetDefault } from '../../../store/actions/reservationAction'
import { fetchSlotsBySession } from "../../../store/actions/sessionAction"
import CustomButton from '../../UI/CustomButton/CustomButton'
import SlotsFieldMainAuditorium from "../../Slots/SlotsFieldMainAuditorium/SlotsFieldMainAuditorium"
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router"
import styles from "./ReservationPostForm.module.css"


const ReservationPostForm = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const store = useStore()
    let session = useSelector(state => state.session.session)
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
                if (router.isReady) {
                    const idReservation = store.getState().reservation.reservation.id
                    router.push(`/confirm/${idReservation}`)
                }
            }
            else {
                if (router.isReady) {
                    router.push('/control')
                }
            }
        })
    }

    return (
        <>
            { session.auditorium_title === 'Главный зал' 
                ?
                    <SlotsFieldMainAuditorium rows={slots} />
                : 
                    null
            }
            <div className={styles.errorMessage}>{error}</div>
            <CustomButton type="submit" value="Подтвердить" onClickHook={postEmailReservation} />
        </>
    )
}

export default ReservationPostForm