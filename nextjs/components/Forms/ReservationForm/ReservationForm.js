import styles from "./ReservationForm.module.css"
import ReservationPostForm from "../ReservationPostForm/ReservationPostForm"
import { useSelector } from "react-redux"


const ReservationForm = () => {
    let play = useSelector(state => state.play.play)
    let session = useSelector(state => state.session.session)
    
    return (
        <>
            <div className={styles.infoCard}>
                <p className={styles.infoCardTitle}>Информация о сеансе</p>
                <p className={styles.playInfo}>Спектакль: {play.title}</p>
                <p className={styles.playInfo}>Дата и время: {session.timestamp}</p>
                <p className={styles.playInfo}>Зал: {session.auditorium_title}</p>
            </div>
            <form className={styles.postForm}>
                <ReservationPostForm />
            </form>

        </>
        
    )
};

export default ReservationForm;
