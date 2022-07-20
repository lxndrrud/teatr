import React from 'react'
import styles from "./ReservationDetail.module.css"
import { ButtonLink } from "../../UI/ButtonLink/ButtonLink"
import ReservationSlotList from '../../Slots/ReservationSlotList/ReservationSlotList'
import { useDispatch, useSelector } from 'react-redux'
import { Table } from 'react-bootstrap'
import TooltipButton from '../../UI/TooltipButton/TooltipButton'
import Link from 'next/link'
import { CustomLink } from '../../UI/CustomLink/CustomLink'

const ReservationDetail = ({ reservation }) => {
    /*
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
                        &nbsp;
                        <TooltipButton 
                            tooltipText="Неподтвержденные брони удаляются через 15 минут после создания!"
                            buttonText="?"
                        />
                    </p>
                    <p className={styles.textLabel}>
                        <span className={styles.bold}>Статус оплаты:</span> {
                            reservation.is_paid
                                ? <span className={styles.statusOk}>Оплачено</span>
                                : <span className={styles.statusProblem}>Не оплачено</span>
                        }
                        &nbsp;
                        <TooltipButton 
                            tooltipText="Неоплаченные брони удаляются за 15 минут до начала сеанса!"
                            buttonText="?"
                        />
                    </p>
                    <p className={styles.textLabel}>
                        <span className={styles.bold}>Стоимость:</span> {reservation.total_cost} рублей
                    </p>

    */
    return (
        <div className={styles.reservationItem}>
                <div className={styles.columnContainer}>
                    <Table striped bordered hover className={styles.table}>
                    <tbody>
                        <tr>
                            <td><span className={styles.bold}>Номер брони:</span></td>
                            <td>{reservation.id}</td>
                        </tr>
                        <tr>
                            <td><span className={styles.bold}>Название спектакля:</span></td>
                            <td> 
                                <CustomLink text={reservation.play_title} 
                                    destination={`/repertoire/${reservation.id_play}`}/>
                            </td>
                        </tr>
                        <tr>
                            <td><span className={styles.bold}>Зал:</span></td>
                            <td>{reservation.auditorium_title}</td>
                        </tr>
                        <tr>
                            <td><span className={styles.bold}>Время сеанса:</span></td>
                            <td>{reservation.session_timestamp}</td>
                        </tr>
                        <tr>
                            <td><span className={styles.bold}>Время бронирования:</span></td>
                            <td>{reservation.created_at}</td>
                        </tr>
                        <tr>
                            <td><span className={styles.bold}>Статус подтверждения:</span></td>
                            <td>
                                {
                                    reservation.is_confirmed
                                        ? <span className={styles.statusOk}>Подтверждено</span>
                                        : <span className={styles.statusProblem}>Не подтверждено</span>
                                }
                                &nbsp;
                                <TooltipButton 
                                    tooltipText="Неподтвержденные брони удаляются через 15 минут после создания!"
                                    buttonText="?"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><span className={styles.bold}>Статус оплаты:</span></td>
                            <td>
                                {
                                    reservation.is_paid
                                        ? <span className={styles.statusOk}>Оплачено</span>
                                        : <span className={styles.statusProblem}>Не оплачено</span>
                                }
                                &nbsp;
                                <TooltipButton 
                                    tooltipText="Неоплаченные брони удаляются за 15 минут до начала сеанса!"
                                    buttonText="?"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><span className={styles.bold}>Стоимость:</span></td>
                            <td>{reservation.total_cost} рублей</td>
                        </tr>
                    </tbody>
                        
                    </Table>
                    
                </div>
                
                <div className={styles.columnContainer}>
                    <ReservationSlotList slots={reservation.slots} />
                    {
                        reservation.can_user_confirm
                        ? <ButtonLink
                            linkType="green" 
                            text='Подтвердить бронь' 
                            destination={`/confirm/${reservation.id}`} />
                        : null
                    }
                    {
                        reservation.can_user_pay
                        ? <ButtonLink 
                            linkType="green"
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
    )
}

export default ReservationDetail