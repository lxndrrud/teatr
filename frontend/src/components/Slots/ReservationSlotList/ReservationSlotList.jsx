import React from 'react'
import ReservationSlotItem from '../ReservationSlotItem/ReservationSlotItem'
import styles from './ReservationSlotList.module.css'

function ReservationSlotList({ slots }) {
    return (
        <div>
            <p className="font-bold text-[20px] text-center md:text-justify">Забронированные места</p>
            <ul className={styles.slotsList}>
                {slots && slots.map(slot => 
                    <ReservationSlotItem slot={slot} key={slot.id}/>
                )}
            </ul>
        </div>
    )
}

export default ReservationSlotList