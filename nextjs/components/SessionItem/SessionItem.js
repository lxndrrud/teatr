import { ButtonLink } from "../ButtonLink/ButtonLink"
import styles from './SessionItem.module.css'

export default function SessionItem({ session }) {
    const destinationURL = `/reserve/${session.id}`
    
    return (
        <div className={styles.sessionItem} >
            <h2>{session.play_title}</h2>
            <h3>{session.auditorium_title}</h3>
            <h3>{session.date} {session.time}</h3>
            <ButtonLink destination={destinationURL} text="Оформить бронь"/> 
        </div>
    )
}