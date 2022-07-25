import styles from "./PlayDetail.module.css"
import CardImage from "../../UI/Images/CardImage/CardImage"
import SessionList from "../../Sessions/SessionList/SessionList"



export default function PlayDetail({ play, sessions, images}) {

    return (
        <div className={styles.container}>
            <div className={styles.subcontainer}>
                <CardImage filepath={play.poster_filepath} altDescription={play.title} />
                <h2 className={styles.playDescription}>{play.description}</h2>
            </div>
            <div className={styles.sessionListContainer}>
                <p className={styles.bold}>Сеансы</p>
                <SessionList sessions={sessions} />
            </div>
        </div>
    )
    
}