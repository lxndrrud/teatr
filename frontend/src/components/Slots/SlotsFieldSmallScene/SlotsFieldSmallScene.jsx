import React from 'react'
import SlotItem from '../SlotItem/SlotItem'
import styles from "../SlotsFieldMainAuditorium/SlotsFieldMainAuditorium.module.css"
import secondaryStyles from "./SlotsFieldSmallScene.module.css"

function SlotsFieldSmallScene({ rows }) {
    const mainRows = [],
        secondaryRows = []

    rows.forEach(row => {
        if (row.title.toLowerCase().includes("первый сектор")) {
            mainRows.push(row)
        }
        else if (row.title.toLowerCase().includes("второй сектор")) {
            secondaryRows.push(row)
        }
    })

    return (
        <div className={styles.container}> 
            <p className={styles.sceneLabel}>Малая сцена</p> 
            <span className={styles.scene}>Сцена</span>
            <div className={styles.tableContainer}>
                <div className={secondaryStyles.firstSector}>
                    {mainRows && mainRows.map(row => (
                        <div key={row.number} className={styles.tableRow}>
                            <span className={styles.rowLabel}>{row.title} Ряд #{row.number}</span>
                            {row.seats.map(slot => (
                                <SlotItem key={slot.id} slotObject={slot} />
                            ))}
                        </div>
                    ))}
                </div>
                <div className={secondaryStyles.secondSector}>
                    {secondaryRows && secondaryRows.map(row => (
                        <div key={row.number} className={styles.tableRow}>
                            <span className={styles.rowLabel}>{row.title} Ряд #{row.number}</span>
                            {row.seats.map(slot => (
                                <SlotItem key={slot.id} slotObject={slot} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SlotsFieldSmallScene