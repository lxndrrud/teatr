import SessionItem from '../SessionItem/SessionItem.js'
import styles from './SessionList.module.css'
import { useSelector } from 'react-redux'



export default function SessionList() {
    const sessions = useSelector(state => state.session.sessions)

    return (
        <div className={styles.sessions}>
            {sessions && sessions.map(session => (
                <SessionItem session={session} key={session.id} />
            ))}
        </div>
    )

}