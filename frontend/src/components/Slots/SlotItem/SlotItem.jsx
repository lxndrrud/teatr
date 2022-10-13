import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import styles from './SlotItem.module.css'
import { reservationReducer } from '../../../store/reducers/reservationReducer'

function Slot({ seatNumber, rowNumber, price }) {
    return (
        <div className='absolute bg-[#ae2876] p-2 rounded-md'>
            <p>Место: {seatNumber}</p>
            <p>Ряд: {rowNumber}</p>
            <p>{price} р.</p>
        </div>
    )
}

function SlotItem({ slotObject }) { 
    const dispatch = useDispatch()

    let [isClicked, setIsClicked] = useState(false)
    let [isMouseWithin, setIsMouseWithin] = useState(false)
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
            if (isClicked) dispatch(reservationReducer.actions.deleteSlot({
                id: slotObject.id,
                seat_number: slotObject.seat_number,
                row_number: slotObject.row_number,
                price: slotObject.price
            }))
            else dispatch(reservationReducer.actions.addSlot({
                id: slotObject.id,
                seat_number: slotObject.seat_number,
                row_number: slotObject.row_number,
                price: slotObject.price
            }))
            setIsClicked(!isClicked)
        }
    }

    
    

    return (
        <div className={styleClass} onClick={slotClick} onMouseEnter={() => setIsMouseWithin(true)} 
            onMouseLeave={() => setIsMouseWithin(false)}>
            {
                isMouseWithin && <Slot seatNumber={slotObject.seat_number} price={slotObject.price} rowNumber={slotObject.row_number}  />
            }
        </div>
    )
}

export default SlotItem