import React from 'react'
import styles from "./ReservationItem.module.css"
import CustomButton from "../../UI/CustomButton/CustomButton"
import ReservationSlotItem from '../../Slots/ReservationSlotItem/ReservationSlotItem'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from "next/router"
import { deleteReservation } from '../../../store/actions/reservationAction'

const ReservationItem = ({ reservation }) => {
    const dispatch = useDispatch()
    const token = useSelector(state => state.user.token)
    const router = useRouter()
    
    const deleteReservationClick = (e) => {
        e.preventDefault()

        dispatch(deleteReservation({ token, id_reservation: reservation.id }))
        .then(() => {
            if (router.isReady) {
                router.push('/control')
            }
        })
    }


    return (
        <div className={styles.reservationItem}>
            <p className={styles.textLabel}>Название спектакля: {reservation.play_title}</p>
            <p className={styles.textLabel}>Зал: {reservation.auditorium_title}</p>
            <p className={styles.textLabel}>Время сеанса: {reservation.session_timestamp}</p>
            <p className={styles.textLabel}>Время бронирования: {reservation.created_at}</p>
            <p className={styles.textLabel}>Стоимость: {reservation.total_cost} рублей</p>
            <ul className={styles.slotsList}>
                {reservation.slots && reservation.slots.map(slot => 
                    <ReservationSlotItem slot={slot} key={slot.id}/>
                )}
            </ul>
            <CustomButton type="submit" value="Удалить бронь" 
                onClickHook={deleteReservationClick}
                styleClass={styles.deleteReservationButton} />
        </div>
    )
}

export default ReservationItem