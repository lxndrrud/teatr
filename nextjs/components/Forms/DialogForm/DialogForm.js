import React from 'react'
import BaseForm from '../BaseForm/BaseForm'
import CustomButton from "../../UI/CustomButton/CustomButton"

import styles from "./DialogForm.module.css"

const DialogForm = ({ text, onClickHook }) => {
    return (
        <BaseForm styleClass={styles.dialogForm} > 
            <span className={styles.text}>{text}</span>
            <CustomButton type="submit" value="Подтвердить"
                styleClass={styles.postButton} onClickHook={onClickHook}/>
        </BaseForm>
    )
}

export default DialogForm