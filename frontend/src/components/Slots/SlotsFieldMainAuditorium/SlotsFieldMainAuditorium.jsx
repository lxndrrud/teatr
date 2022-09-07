import React from 'react'
import SlotItem from '../SlotItem/SlotItem'
import styles from "./SlotsFieldMainAuditorium.module.css"

function SlotsFieldMainAuditorium({ rows }) {
    const parterRows = [],
        sideBalconyRows = [],
        mainBalconyRows = []

    rows.forEach(row => {
        if (row.title.toLowerCase().includes("партер")) {
            parterRows.push(row)
        }
        else if (row.title.toLowerCase().includes("балкон") && (row.title.toLowerCase().includes("крыло"))) {
            sideBalconyRows.push(row)
        }
        else if (row.title.toLowerCase().includes("балкон") && (row.title.toLowerCase().includes("средняя часть"))) {
            mainBalconyRows.push(row)
        }
    })

    return (
        <div className={styles.container}> 
            <p className={styles.sceneLabel}>Главный зал</p> 
            <span className={styles.scene}>Сцена</span>
            <div className={styles.tableContainer}>
                {parterRows && parterRows.map(row => (
                    <div key={row.id} className={styles.tableRow}>
                        <span className={styles.rowLabel}>{row.title} Ряд #{row.number}</span>
                        {row.seats.map(slot => (
                            <SlotItem key={slot.id} slotObject={slot} />
                        ))}
                    </div>
                ))}
                <div className={styles.balconySideRowsContainer} >
                    {sideBalconyRows && sideBalconyRows.map(row => (
                        <div key={row.id} className={styles.tableColumn}>
                            <span className={styles.rowLabel}>{row.title} Ряд #{row.number}</span>
                            {row.seats.map(slot => (
                                <SlotItem key={slot.id} slotObject={slot} />
                            ))}
                        </div>
                    ))}
                </div>
                {mainBalconyRows && mainBalconyRows.map(row => (
                    <div key={row.id} className={styles.tableRow}>
                        <span className={styles.rowLabel}>{row.title} Ряд #{row.number}</span>
                        {row.seats.map(slot => (
                            <SlotItem key={slot.id} slotObject={slot} />
                        ))}
                    </div>
                ))}
                
            </div>
        </div>
    )
    
}

export default SlotsFieldMainAuditorium