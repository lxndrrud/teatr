import React from 'react'
import SlotItem from '../SlotItem/SlotItem'
import styles from "./SlotsFieldMainAuditorium.module.css"

const SlotsFieldMainAuditorium = ({ rows }) => {
    return (
        <div className={styles.container}> 
            <p className="font-bold text-lg mb-5">Главный зал</p> 
            <span className={styles.scene}>Сцена</span>
            <table className={styles.tableContainer} rules="rows">
                <tbody>
                    {rows && rows.map(row => (
                        <tr key={row.number} className={styles.tableRow}>
                            <td className="text-base">Ряд #{row.number}</td>
                            {row.seats.map(slot => (
                                <td key={slot.id}>
                                    <SlotItem key={slot.id} slotObject={slot} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
    
}

export default SlotsFieldMainAuditorium