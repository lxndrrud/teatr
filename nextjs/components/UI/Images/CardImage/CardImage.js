import React from 'react'
import styles from "./CardImage.module.css"

const CardImage = ({ filepath, altDescription }) => {
    return (
        <img className={styles.cardImage} 
            src={filepath} alt={altDescription} />
    )
}

export default CardImage