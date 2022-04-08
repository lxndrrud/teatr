import React from 'react'
import ReservationSlotItem from '../ReservationSlotItem/ReservationSlotItem'
import styles from './ReservationSlotList.module.css'

const ReservationSlotList = ({ slots }) => {
    return (
        <div>
            <p className={styles.slotsListLabel}>Забронированные места</p>
            <ul className={styles.slotsList}>
                {slots && slots.map(slot => 
                    <ReservationSlotItem slot={slot} key={slot.id}/>
                )}
            </ul>
        </div>
        
    )
}

export default ReservationSlotList