import React from 'react'
import styles from "./ReservationItem.module.css"
import CustomButton from "../../UI/CustomButton/CustomButton"
import { ButtonLink } from "../../UI/ButtonLink/ButtonLink"
import ReservationSlotList from '../../Slots/ReservationSlotList/ReservationSlotList'
import { useDispatch, useSelector } from 'react-redux'
import { deleteReservation } from '../../../store/actions/reservationAction'

const ReservationItem = ({ reservation }) => {
    const dispatch = useDispatch()
    const token = useSelector(state => state.user.token)
    
    const deleteReservationClick = (e) => {
        e.preventDefault()

        dispatch(deleteReservation({ token, id_reservation: reservation.id }))
    }
    /*
    
    {
                reservation.can_user_delete 
                ? <CustomButton type="submit" value="Удалить бронь" 
                    onClickHook={deleteReservationClick}
                    styleClass={styles.deleteReservationButton} />
                : null
            }
    
    */


    return (
        <div className={styles.reservationItem}>
            <div className={styles.flexWidthContainer}>
                <div className={styles.columnContainer}>
                    <p className={styles.textLabel}>
                        <span className={styles.bold}>Номер брони:</span> {reservation.id}
                    </p>
                    <p className={styles.textLabel}>
                        <span className={styles.bold}>Название спектакля:</span> {reservation.play_title}
                    </p>
                    <p className={styles.textLabel}>
                        <span className={styles.bold}>Зал:</span> {reservation.auditorium_title}
                    </p>
                    <p className={styles.textLabel}>
                        <span className={styles.bold}>Время сеанса:</span> {reservation.session_timestamp}
                    </p>
                    <p className={styles.textLabel}>
                        <span className={styles.bold}>Время бронирования:</span> {reservation.created_at}
                    </p>
                    <p className={styles.textLabel}>
                        <span className={styles.bold}>Статус подтверждения:</span> {
                            reservation.is_confirmed
                                ? <span className={styles.statusOk}>Подтверждено</span>
                                : <span className={styles.statusProblem}>Не подтверждено</span>
                        }
                    </p>
                    <p className={styles.textLabel}>
                        <span className={styles.bold}>Статус оплаты:</span> {
                            reservation.is_paid
                                ? <span className={styles.statusOk}>Оплачено</span>
                                : <span className={styles.statusProblem}>Не оплачено</span>
                        }
                    </p>
                    <p className={styles.textLabel}>
                        <span className={styles.bold}>Стоимость:</span> {reservation.total_cost} рублей
                    </p>
                </div>
                
                <div className={styles.columnContainer}>
                    <ReservationSlotList slots={reservation.slots} />
                    {
                        reservation.can_user_confirm
                        ? <ButtonLink 
                            text='Подтвердить бронь' 
                            destination={`/confirm/${reservation.id}`} />
                        : null
                    }
                    {
                        reservation.can_user_pay
                        ? <ButtonLink 
                            text='Пометить оплаченной' 
                            destination={`/control/payment/${reservation.id}`} />
                        : null
                    }
                    {
                        reservation.can_user_delete
                        ? <ButtonLink 
                            text='Удалить бронь' 
                            linkType = "red"
                            destination={`/control/delete/${reservation.id}`} />
                        : null
                    }
                </div>
            </div>
        </div>
    )
}

export default ReservationItem