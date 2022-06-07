import React, { useState } from 'react'
import { OverlayTrigger, Button, Tooltip } from "react-bootstrap"
import styles from "./TooltipButton.module.css"


const TooltipButton = ({ tooltipText, buttonText }) => {
    let [isTextHidden, setIsTextHidden] = useState(true)
    let style = isTextHidden 
        ? `${styles.tooltipText} ${styles.hiddenText}` 
        : styles.tooltipText
    /*
    <OverlayTrigger
            placement="right"
            overlay={
                <Tooltip className={styles.tooltipText}>
                    <strong>{tooltipText}</strong>
                </Tooltip>
            }
        >
            // Вставить сюда кнопку 
    </OverlayTrigger>    


    {
                !isTextHidden 
                ? <span className={styles.tooltipText}>
                    <strong>{tooltipText}</strong>
                </span>
                : null
            }
    */
    return (
        <span className={styles.container}>
            <Button variant="secondary" className={styles.tooltipButton} 
                onClick={() => { setIsTextHidden(!isTextHidden) }}>
                    {buttonText}
            </Button>
            <span className={style}>
                <strong>{tooltipText}</strong>
            </span>
            
        </span>
           
    )
}

export default TooltipButton