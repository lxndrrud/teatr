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
                <p className={styles.playInfo}>
                    <span className={styles.bold}>Спектакль:</span> {play.title}
                </p>
                <p className={styles.playInfo}>
                    <span className={styles.bold}>Дата и время:</span> {session.timestamp}
                </p>
                <p className={styles.playInfo}>
                    <span className={styles.bold}>Зал:</span> {session.auditorium_title}
                </p>
                <p className={styles.playInfo}>
                    <span className={styles.bold}>Максимум мест для брони:</span> {session.max_slots}
                </p>
            </div>
            <form className={styles.postForm}>
                <ReservationPostForm />
            </form>

        </>
        
    )
};

export default ReservationForm;
