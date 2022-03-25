import React, { useState, useEffect } from 'react'
import Select from '../../UI/Select/Select'
import Checkbox from '../../UI/Checkbox/Checkbox'
import CustomButton from '../../UI/CustomButton/CustomButton'
import styles from "./ReservationFilter.module.css"
import { useDispatch, useSelector } from 'react-redux'

const ReservationFilter = () => {
    const dispatch = useDispatch()

    // Состояния фильтра
    let [date, setDate] = useState('')
    let [auditoriumTitle, setAuditoriumTitle] = useState('')
    let [playTitle, setPlayTitle] = useState('')
    let [showLocked, setShowLocked] = useState(false)

    useEffect(() => {
        
        dispatch(fetchReservationFilterOptions())
    }, [])

    // Функции для синронизации состояния с input`ами
    const syncDate = () => {
        if (e.target.value === 'None') setDate('')
        else setDate(e.target.value)
    }
    const syncAuditoriumTitle = (e) => {
        if (e.target.value === 'None') setAuditoriumTitle('')
        else setAuditoriumTitle(e.target.value)
    }

    const syncPlayTitle = (e) => {
        if (e.target.value === 'None') setPlayTitle('')
        else setPlayTitle(e.target.value)
    }
    const syncShowLockedCheckbox = (e) => {
        setShowLocked(!showLocked)
    }

    // Получение свойств для выбора в селекторе
    const reservationfilterOptions = useSelector(state => state.reservation.filterOptions)

    const getFilteredReservations = () => {
        e.preventDefault()
        
        dispatch(fetchFilteredReservations(date, auditoriumTitle, playTitle, showLocked))
    }

    return (
        <div>
            <Select onChange={syncDate}>
                <option value="None">Все даты</option>

                {sessionFilterOptions.dates && filterOptions.dates.map(item => (
                  <option value={item.date}>
                    {item.extended_date}
                  </option>  
                ))}
            </Select>

            <Select onChange={syncAuditoriumTitle}>
                <option value="None">Все залы</option>

                {sessionFilterOptions.auditoriums && filterOptions.auditoriums.map(item => (
                    <option value={item.title}>
                        {item.title}
                    </option>
                ))}
            </Select>

            <Select onChange={syncPlayTitle}>
                <option value="None">Все спектакли</option>

                {sessionFilterOptions.plays && filterOptions.plays.map(item => (
                    <option value={item.title}>
                        {item.title}
                    </option>
                ))}   
            </Select>

            <Checkbox id="showLocked" name="showLocked" labelText="Показать закрытые" 
                defaultChecked={showLocked} onChange={syncShowLockedCheckbox} />

            <CustomButton type="submit" value="Подтвердить" onClickHook={getFilteredReservations} />
        </div>
    )
}

export default ReservationFilter