import React from 'react'
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage"
import CustomButton from "../../UI/CustomButton/CustomButton"

import styles from "./DialogForm.module.css"

function DialogForm({ text, onClickHook, buttonType, error }) {
    const buttonStyle = buttonType === "submit" ? "blue" : "red"
    const buttonValue = buttonType === "submit" ? "Подтвердить" : "Удалить"
    return (
        <div className={styles.dialogForm}>
             <span className={styles.text}>{text}</span>
            {
                error
                ? <ErrorMessage text={error} />
                : null
            }
            <CustomButton type="submit" value={buttonValue}
                buttonType={buttonStyle} onClickHook={onClickHook}/>
        </div>
    )
}

export default DialogForm