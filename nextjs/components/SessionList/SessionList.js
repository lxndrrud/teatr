import SessionItem from '../SessionItem/SessionItem.js'
import styles from './SessionList.module.css'

export default function SessionList({ sessions }) {
    return (
        <div className={styles.sessions}>
            {sessions && sessions.map(session => (
                <SessionItem session={session} key={session.id} />
            ))}
        </div>
    )

}