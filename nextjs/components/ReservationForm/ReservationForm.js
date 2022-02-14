import styles from "./ReservationForm.module.css"
import ReservationPostForm from "../ReservationPostForm/ReservationPostForm"
import ReservationConfirmationForm from "../ReservationConfirmationForm/ReservationConfirmationForm"
import { useSelector } from "react-redux"




const ReservationForm = ({ session }) => {
    let showConfirmationField = useSelector(state => state.reservation.showConfirmationField)
    
    return (
        <>
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
