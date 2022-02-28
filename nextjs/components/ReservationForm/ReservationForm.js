import styles from "./ReservationForm.module.css"
import ReservationPostForm from "../ReservationPostForm/ReservationPostForm"
import ReservationConfirmationForm from "../ReservationConfirmationForm/ReservationConfirmationForm"
import DateString from "../DateString/DateString"
import { useSelector } from "react-redux"


const ReservationForm = ({ session, play }) => {
    let showConfirmationField = useSelector(state => state.reservation.showConfirmationField)
    
    return (
        <>
            <div className={styles.infoCard}>
                <p className={styles.infoCardTitle}>Информация о сеансе</p>
                <p className={styles.playInfo}>Спектакль: {play.title}</p>
                <p className={styles.playInfo}>Дата и время: <DateString date={session.date} /> {session.time}</p>
                <p className={styles.playInfo}>Зал: {session.auditorium_title}</p>
            </div>
            <form className={styles.postForm}>
                {showConfirmationField 
                    ? 
                    <ReservationConfirmationForm />
                    : 
                    <ReservationPostForm session={session} />
                }
            </form>

        </>
        
    )
};

export default ReservationForm;
