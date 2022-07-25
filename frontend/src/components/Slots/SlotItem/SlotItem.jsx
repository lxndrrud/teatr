import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { addSlot, deleteSlot } from '../../../store/actions/reservationAction'
import styles from './SlotItem.module.css'

function SlotItem({ slotObject }) { 
    const dispatch = useDispatch()

    let [isClicked, setIsClicked] = useState(false)
    const slotStyle = () => {
        if (slotObject.is_reserved) return `${styles.slot} ${styles.reservedContainer}`
        if (isClicked) return `${styles.slot} ${styles.clickedContainer}`
        return `${styles.slot} ${styles.freeContainer}`
    }
    let [styleClass, setStyleClass] = useState(slotStyle())

    useEffect(() => {
        setStyleClass(slotStyle())
    }, [isClicked, slotObject.is_reserved])


    const slotClick = () => { 
        if (!slotObject.is_reserved) {
            if (isClicked) dispatch(deleteSlot({
                id: slotObject.id,
                seat_number: slotObject.seat_number,
                row_number: slotObject.row_number,
                price: slotObject.price
            }))
            else dispatch(addSlot({
                id: slotObject.id,
                seat_number: slotObject.seat_number,
                row_number: slotObject.row_number,
                price: slotObject.price
            }))
            setIsClicked(!isClicked)
        }
    }

    return (
        <div className={styleClass} onClick={slotClick}>
            <p>#{slotObject.seat_number}</p>
            <p>{slotObject.price} р.</p>
        </div>
    )
}

export default SlotItem