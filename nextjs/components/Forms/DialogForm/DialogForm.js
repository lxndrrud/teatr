import React from 'react'
import ErrorMessage from "../../../components/UI/ErrorMessage/ErrorMessage"
import CustomButton from "../../UI/CustomButton/CustomButton"

import styles from "./DialogForm.module.css"

const DialogForm = ({ text, onClickHook, buttonType, error }) => {
    const buttonStyle = buttonType === "submit" ? "blue" : "red"
    const buttonValue = buttonType === "submit" ? "Подтвердить" : "Удалить"
    return (
        <div className={styles.dialogForm}>
             <span className={styles.text}>{text}</span>
            {
                error !== null 
                ? <ErrorMessage text={error} />
                : null
            }
            <CustomButton type="submit" value={buttonValue}
                buttonType={buttonStyle} onClickHook={onClickHook}/>
        </div>
    )
}

export default DialogForm