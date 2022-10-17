import { useDispatch, useSelector, useStore } from 'react-redux'
import { createReservation } from '../../../store/actions/reservationAction'
import { fetchSlotsBySession } from "../../../store/actions/sessionAction"
import CustomButton from '../../UI/CustomButton/CustomButton'
import SlotsFieldMainAuditorium from "../../Slots/SlotsFieldMainAuditorium/SlotsFieldMainAuditorium"
import SlotsFieldSmallScene from "../../Slots/SlotsFieldSmallScene/SlotsFieldSmallScene"
import Preloader from '../../UI/Preloader/Preloader'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import swal from 'sweetalert2'
import { sessionReducer } from '../../../store/reducers/sessionReducer'
import { reservationReducer } from '../../../store/reducers/reservationReducer'


function ReservationPostForm() {
    const dispatch = useDispatch()
    const navigate = useNavigate() 
    const store = useStore()

    let isLoading = useSelector(state => state.session.isLoading)
    let token = useSelector(state => state.user.token)
    let session = useSelector(state => state.session.session)
    let sessionSlots = useSelector(state => state.session.slots)
    let reservationSlots = useSelector(state => state.reservation.slots)
    let errorSession = useSelector(state => state.session.error)

    async function subscribe() {
        try {
            const response = await axios.get(`/expressjs/sessions/${session.id}/slots/polling`, {
                headers: {
                    "auth-token": token,
                }
            }) 
            dispatch(sessionReducer.actions.fetchSlots(response.data))
            .then(async () => { await subscribe() })
        } catch (e) {
            setTimeout(() => {
                subscribe()
            }, 500)
        }
    }

    useEffect(() => {
        dispatch(reservationReducer.actions.clearSlots())
        if (session.id) {
            dispatch(fetchSlotsBySession({ token, idSession: session.id }))
                .then(async () => { await  subscribe() })
            if (errorSession) {
                swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorSession,
                    icon: 'error'
                })
                dispatch(sessionReducer.actions.clearError())
            }
        }
    }, [dispatch, token, session])

    


    const postEmailReservation = (e) => {
        e.preventDefault()

        // Отправить на backend запрос по почте
        dispatch(createReservation({
            token: token, 
            idSession: session.id,
            slots: reservationSlots
        }))
        .then(async () => {
            const errorReservation = store.getState().reservation.error
            const needConfirmation = store.getState().reservation.need_confirmation
            if (errorReservation) {
                swal.fire({
                    title: 'Произошла ошибка!',
                    text: errorReservation,
                    icon: "error"
                })
                await dispatch(reservationReducer.actions.clearError())
            } else if (needConfirmation) {
                const idReservation = store.getState().reservation.reservation.id
                swal.fire({
                    title: 'Бронь оформлена!',
                    text: 'Необходимо подтверждение.',
                    icon: 'success',
                    timer: 2000
                })
                setTimeout(navigate(`/confirm/${idReservation}`), 2100)
            } else {
                swal.fire({
                    title: 'Бронь оформлена!',
                    icon: 'success',
                    timer: 2000
                })
                setTimeout(navigate('/control'), 2100)
            }
        })
        
    }

    return (
        <>
            { 
                isLoading
                ?
                    <Preloader />
                :
                    (session.auditorium_title === 'Главный зал' 
                        ? <SlotsFieldMainAuditorium rows={sessionSlots} />
                        : session.auditorium_title === 'Малая сцена'
                            ? <SlotsFieldSmallScene rows={sessionSlots} />
                            : null)
            }
            <CustomButton type="submit" value="Подтвердить" onClickHook={postEmailReservation} />
        </>
    )
}

export default ReservationPostForm