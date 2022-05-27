import { Card } from "react-bootstrap"
import { ButtonLink } from "../../UI/ButtonLink/ButtonLink"
import styles from "./ReservationItem.module.css"

import React from 'react'

function ReservationItem({ reservation }) {
    console.log(reservation)
    return (
        <Card className={styles.card}>
            {
                !reservation.session_is_locked
                ? 
                    <Card.Header className={styles.cardHeader}>
                        Сеанс еще не состоялся!
                    </Card.Header>
                :   <Card.Header className={styles.invisibleCardHeader}>
                        Сеанс состоялся!
                    </Card.Header>
            }
            <Card.Body className={styles.cardBody}>
                    <p>Бронь #{reservation.id}</p>
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
                    <span className={styles.bold}>Количество мест:</span> {reservation.slots.length}
                    </p>
                    <ButtonLink destination={`/control/${reservation.id}`} text="Подробнее" 
                        linkType="green"/>
            </Card.Body>

        </Card>
    )
}

export default ReservationItem