import styles from "./PlayDetail.module.css"
import SessionList from "../../components/SessionList/SessionList"



export default function PlayDetail({ play, sessions, images}) {

    return (
        <div className={styles.container}>
            <h2>{play.description}</h2>
            <div className={styles.sessionListContainer}>
                <p>Сеансы</p>
                <SessionList sessions={sessions} />
            </div>
            
        </div>
    )
    
}