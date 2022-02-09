import styles from "./ReservationForm.module.css"
import { useState } from "react"


const ReservationForm = ({ idSession }) => {
    let [email, setEmail] = useState('')
    const syncEmail = (e) => {
        setEmail(e.target.value)
    }
    const postForm = (e) => {
        e.preventDefault()
        console.log('kek')
        // Отправить на backend запрос по почте
    }

    return (
        <form className={styles.postForm}>
            <input type="email" name="email" value={email} onChange={syncEmail} required />
            <input type="submit" value="Подтвердить" onClick={postForm}/>
        </form>
    )
};

export default ReservationForm;
