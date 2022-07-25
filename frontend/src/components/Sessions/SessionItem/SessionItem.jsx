import ButtonLink from "../../UI/ButtonLink/ButtonLink"
import CardImage from "../../UI/Images/CardImage/CardImage"
import styles from './SessionItem.module.css'

export default function SessionItem({ session }) {
    const destinationURL = `/reserve/${session.id}`
    
    return (
        <div className={styles.sessionItem} >
            <p className={styles.playTitle}>{session.play_title}</p>
            <div className={styles.rowContainer}>
                <div className={styles.columnContainer}>
                    <CardImage filepath={ session.poster_filepath } 
                        altDescription={`Здесь должен был быть постер спектакля "${session.play_title}"...`} />
                </div>
                <div className={styles.columnContainer} style={{marginLeft: "10px", 
                                                                justifyContent: "space-between"}}>
                    <div className={styles.columnContainer} >
                        <p className={styles.auditoriumTitle}>
                            <svg style={{ width: "24px", height:"24px", viewBox: "0 0 24 24", float: "left", marginRight: "10px"}}>
                            <path fill="#000" d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
                            </svg>
                            {session.auditorium_title}
                        </p>
                        <p className={styles.sessionTimestamp}>
                            <svg style={{ width:"24px", height:"24px", viewBox: "0 0 24 24", float: "left", marginRight: "10px"}}>
                            <path fill="#000" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                            </svg>
                            {session.timestamp}
                        </p>
                    </div>
                    <ButtonLink destination={destinationURL} text="Оформить бронь"/>
                </div>
            </div>
        </div>
    )
}