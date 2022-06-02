import React from 'react'
import { OverlayTrigger, Button, Tooltip } from "react-bootstrap"
import styles from "./TooltipButton.module.css"


const TooltipButton = ({ tooltipText, buttonText }) => {
    return (
        <OverlayTrigger
            placement="right"
            overlay={
                <Tooltip className={styles.tooltipText}>
                    <strong>{tooltipText}</strong>
                </Tooltip>
            }
        >
            <Button variant="secondary" className={styles.tooltipButton}>
                {buttonText}
            </Button>
        </OverlayTrigger>
    )
}

export default TooltipButton