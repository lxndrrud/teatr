import { Card, Table } from "react-bootstrap"
import { ButtonLink } from "../../UI/ButtonLink/ButtonLink"
import styles from "./ReservationItem.module.css"

import React from 'react'

function ReservationItem({ reservation }) {
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
                <p><strong> Номер брони:</strong> {reservation.id}</p>
                <p className={styles.textLabel}>
                    <strong>Название спектакля:</strong> {reservation.play_title}
                </p>
                <p className={styles.textLabel}>
                    <strong>Зал:</strong> {reservation.auditorium_title}
                </p>
                <p className={styles.textLabel}>
                    <strong>Время сеанса:</strong> {reservation.session_timestamp}
                </p>
                <p className={styles.textLabel}>
                    <strong>Количество мест:</strong> {reservation.slots.length}
                </p>
                <ButtonLink destination={`/control/${reservation.id}`} text="Подробнее" 
                    linkType="green"/>
            </Card.Body>

        </Card>
    )
}

export default ReservationItem