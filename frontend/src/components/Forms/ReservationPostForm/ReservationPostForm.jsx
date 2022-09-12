import { useDispatch, useSelector, useStore } from 'react-redux'
import { postReservation, errorSetDefault } from '../../../store/actions/reservationAction'
import { fetchSlots, fetchSlotsBySession } from "../../../store/actions/sessionAction"
import CustomButton from '../../UI/CustomButton/CustomButton'
import SlotsFieldMainAuditorium from "../../Slots/SlotsFieldMainAuditorium/SlotsFieldMainAuditorium"
import SlotsFieldSmallScene from "../../Slots/SlotsFieldSmallScene/SlotsFieldSmallScene"
import React, { useEffect, useState } from 'react'
//import { useRouter } from "next/router"
import { useNavigate } from 'react-router-dom'
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'
import axios from 'axios'


function ReservationPostForm() {
    const dispatch = useDispatch()
    const navigate = useNavigate() 
    const store = useStore()

    let token = useSelector(state => state.user.token)
    let session = useSelector(state => state.session.session)
    let sessionSlots = useSelector(state => state.session.slots)
    let reservationSlots = useSelector(state => state.reservation.slots)

    let [error, setError] = useState(null)

    useEffect(() => {
        if (session.id) {
            dispatch(fetchSlotsBySession(token, session.id))
            subscribe()
        }
    }, [dispatch, token, session])

    async function subscribe() {
        try {
            const response = await axios.get(`/expressjs/sessions/${session.id}/slots/polling`, {
                headers: {
                    "auth-token": token,
                }
            }) 
            dispatch(fetchSlots(response.data))
            .then(async () => { await subscribe() })
        } catch (e) {
            setTimeout(() => {
                subscribe()
            }, 500)
        }
        
    }


    const postEmailReservation = (e) => {
        e.preventDefault()

        // Отправить на backend запрос по почте
        dispatch(postReservation({
            token: token, 
            id_session: session.id,
            slots: reservationSlots
        }))
        .then(() => {
            const errorFromStore = store.getState().reservation.error
            const needConfirmation = store.getState().reservation.need_confirmation
            if (errorFromStore !== null) {
                setError(errorFromStore)
                dispatch(errorSetDefault())
            } else if (needConfirmation) {
                const idReservation = store.getState().reservation.reservation.id
                navigate(`/confirm/${idReservation}`)
            }
            else {
                navigate('/control')
            }
        })
    }

    return (
        <>
            { session.auditorium_title === 'Главный зал' 
                ? <SlotsFieldMainAuditorium rows={sessionSlots} />
                : session.auditorium_title === 'Малая сцена'
                    ? <SlotsFieldSmallScene rows={sessionSlots} />
                    : null
            }
            {
                error && <ErrorMessage text={error} />
            }
            <CustomButton type="submit" value="Подтвердить" onClickHook={postEmailReservation} />
        </>
    )
}

export default ReservationPostForm