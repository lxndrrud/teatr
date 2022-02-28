import { ButtonLink } from "../ButtonLink/ButtonLink"
import DateString from "../DateString/DateString"
import styles from './SessionItem.module.css'

export default function SessionItem({ session }) {
    const destinationURL = `/reserve/${session.id}`
    
    return (
        <div className={styles.sessionItem} >
            <p className={styles.playTitle}>{session.play_title}</p>
            <p className={styles.auditoriumTitle}>{session.auditorium_title}</p>
            <p className={styles.sessionDate}><DateString date={session.date} /> {session.time}</p>
            <ButtonLink destination={destinationURL} text="Оформить бронь"/> 
        </div>
    )
}