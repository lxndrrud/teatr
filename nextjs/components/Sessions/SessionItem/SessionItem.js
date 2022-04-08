import { ButtonLink } from "../../UI/ButtonLink/ButtonLink"
import CardImage from "../../UI/Images/CardImage/CardImage"
import styles from './SessionItem.module.css'

export default function SessionItem({ session }) {
    const destinationURL = `/reserve/${session.id}`
    
    return (
        <div className={styles.sessionItem} >
            <p className={styles.playTitle}>{session.play_title}</p>
            <CardImage filepath={ session.poster_filepath } 
                altDescription={`Здесь должен был быть постер спектакля "${session.play_title}"...`} />
            <p className={styles.auditoriumTitle}>{session.auditorium_title}</p>
            <p className={styles.sessionTimestamp}>{session.timestamp}</p>
            <ButtonLink destination={destinationURL} text="Оформить бронь"/> 
        </div>
    )
}