import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { addSlot, deleteSlot } from '../../store/actions/reservationAction'
import styles from './SlotItem.module.css'

const SlotItem = ({ slotObject }) => { 
    let [isClicked, setIsClicked] = useState(false)
    let [styleClass, setStyleClass] = useState(slotObject.is_reserved 
        ? `rounded-full ${styles.reservedContainer}`
        : (isClicked 
            ? `rounded-full ${styles.clickedContainer}` 
            : `rounded-full ${styles.freeContainer}`))

    useEffect(() => {
        setStyleClass(slotObject.is_reserved 
            ? `rounded-full ${styles.reservedContainer}`
            : (isClicked 
                ? `rounded-full ${styles.clickedContainer}` 
                : `rounded-full ${styles.freeContainer}`))
    }, [isClicked, slotObject.is_reserved])

    const dispatch = useDispatch()

    const slotClick = () => { 
        if (!slotObject.is_reserved) {
            console.log('kek ')
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