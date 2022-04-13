import React from 'react'
import SlotItem from '../SlotItem/SlotItem'
import styles from "./SlotsFieldMainAuditorium.module.css"

const SlotsFieldMainAuditorium = ({ rows }) => {
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

    console.log(parterRows.length, sideBalconyRows.length, mainBalconyRows.length, rows.length)

    return (
        <div className={styles.container}> 
            <p className="font-bold text-lg mb-5">Главный зал</p> 
            <span className={styles.scene}>Сцена</span>
            <div className={styles.tableContainer}>
                {parterRows && parterRows.map(row => (
                    <div key={row.number} className={styles.tableRow}>
                        <span className={styles.rowLabel}>{row.title} Ряд #{row.number}</span>
                        {row.seats.map(slot => (
                            <SlotItem key={slot.id} slotObject={slot} />
                        ))}
                    </div>
                ))}
                <div className={styles.balconySideRowsContainer} >
                    {sideBalconyRows && sideBalconyRows.map(row => (
                        <div className={styles.tableColumn}>
                            <span className={styles.rowLabel}>{row.title} Ряд #{row.number}</span>
                            {row.seats.map(slot => (
                                <SlotItem key={slot.id} slotObject={slot} />
                            ))}
                        </div>
                    ))}
                </div>
                {mainBalconyRows && mainBalconyRows.map(row => (
                    <div key={row.number} className={styles.tableRow}>
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