import { Card, Table } from "react-bootstrap"
import { ButtonLink } from "../../UI/ButtonLink/ButtonLink"
import styles from "./ReservationItem.module.css"

import React from 'react'

function ReservationItem({ reservation }) {

    /* Было
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
    */
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
                <Table className={styles.table} >
                <tbody>
                    <tr>
                        <td>
                            <svg style={{ width: "24px", height:"24px", viewBox: "0 0 24 24", float: "left", marginRight: "10px"}}>
                                <path fill="#000" d="M15.58,16.8L12,14.5L8.42,16.8L9.5,12.68L6.21,10L10.46,9.74L12,5.8L13.54,9.74L17.79,10L14.5,12.68M20,12C20,10.89 20.9,10 22,10V6C22,4.89 21.1,4 20,4H4A2,2 0 0,0 2,6V10C3.11,10 4,10.9 4,12A2,2 0 0,1 2,14V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V14A2,2 0 0,1 20,12Z" />
                            </svg>
                            <strong>Номер брони</strong>
                        </td>
                        <td className={styles.bordered}>{reservation.id}</td>
                    </tr>
                    <tr >
                        <td>
                            <svg style={{ width: "24px", height:"24px", viewBox: "0 0 24 24", float: "left", marginRight: "10px"}}>
                                <path fill="#000" d="M15,20A1,1 0 0,0 16,19V4H8A1,1 0 0,0 7,5V16H5V5A3,3 0 0,1 8,2H19A3,3 0 0,1 22,5V6H20V5A1,1 0 0,0 19,4A1,1 0 0,0 18,5V9L18,19A3,3 0 0,1 15,22H5A3,3 0 0,1 2,19V18H13A2,2 0 0,0 15,20Z" />   
                            </svg>
                            <strong>Название спектакля</strong>
                        </td>
                        <td className={styles.bordered}>{reservation.play_title}</td>
                    </tr>
                    <tr>
                        <td>
                            <svg style={{ width: "24px", height:"24px", viewBox: "0 0 24 24", float: "left", marginRight: "10px"}}>
                                <path fill="#000" d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
                            </svg>
                            <strong>Зал</strong>
                        </td>
                        <td  className={styles.bordered}>{reservation.auditorium_title}</td>
                    </tr>
                    <tr >
                        <td>
                            <svg style={{ width:"24px", height:"24px", viewBox: "0 0 24 24", float: "left", marginRight: "10px"}}>
                                <path fill="#000" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                            </svg>
                            <strong>Время сеанса</strong>
                        </td>
                        <td className={styles.bordered}>{reservation.session_timestamp}</td>
                    </tr>
                    <tr>
                        <td>
                            <svg style={{ width:"24px", height:"24px", viewBox: "0 0 24 24", float: "left", marginRight: "10px"}}>
                                <path fill="#000" d="M4,18V21H7V18H17V21H20V15H4V18M19,10H22V13H19V10M2,10H5V13H2V10M17,13H7V5A2,2 0 0,1 9,3H15A2,2 0 0,1 17,5V13Z" />
                            </svg>
                            <strong>Количество мест</strong>
                        </td>
                        <td className={styles.bordered}>{reservation.slots.length}</td>
                    </tr>
                    
                </tbody>
                </Table>
                <ButtonLink destination={`/control/${reservation.id}`} text="Подробнее" 
                    linkType="green"/>
            </Card.Body>

        </Card>
    )
}

export default ReservationItem