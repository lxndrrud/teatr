import { CustomLink } from "../CustomLink/CustomLink"
import styles from './SessionItem.module.css'

export default function SessionItem({ session }) {
    const editDatetime = (datetime) => {
        const datetimeContent = datetime.split('T')
        let date = datetimeContent[0]
        let time = datetimeContent[1].slice(0, -3)
        const dateContent = date.split('-')
        date = `${dateContent[2]}.${dateContent[1]}.${dateContent[0]}`   
        return `${date} ${time}`
    }
    const datetime = editDatetime(session.datetime)
    const destinationURL = `/reserve/${session.id}`
    
    return (
        <div className={styles.sessionItem}>
            <h2>{session.play_title}</h2>
            <h3>{session.auditorium_title}</h3>
            <h3>{datetime}</h3>
            <CustomLink destination={destinationURL} text="Оформить бронь"/> 
        </div>
    )
}