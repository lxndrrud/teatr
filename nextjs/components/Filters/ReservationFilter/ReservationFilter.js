import React, { useState, useEffect } from 'react'
import Select from '../../UI/Select/Select'
import CustomButton from '../../UI/CustomButton/CustomButton'
import CustomInput from "../../UI/CustomInput/CustomInput"
import styles from "./ReservationFilter.module.css"
import { useDispatch, useSelector } from 'react-redux'
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'

const ReservationFilter = () => {
    const dispatch = useDispatch()

    // Состояния фильтра
    let [date, setDate] = useState()
    let [auditoriumTitle, setAuditoriumTitle] = useState()
    let [playTitle, setPlayTitle] = useState()
    let [reservationNumber, setReservationNumber] = useState()
    let [showLocked, setShowLocked] = useState()
    let [error, setError] = useState('')

    useEffect(() => {
        
        dispatch(fetchReservationFilterOptions())
    }, [])

    // Функции для синронизации состояния с input`ами
    const syncDate = () => {
        if (e.target.value === 'None') setDate(undefined)
        else setDate(e.target.value)
    }
    const syncAuditoriumTitle = (e) => {
        if (e.target.value === 'None') setAuditoriumTitle(undefined)
        else setAuditoriumTitle(e.target.value)
    }

    const syncPlayTitle = (e) => {
        if (e.target.value === 'None') setPlayTitle(undefined)
        else setPlayTitle(e.target.value)
    }
    const syncShowLocked = (e) => {
        setShowLocked(!showLocked)
    }

    const syncReservationNumber = (e) => {
        const parsedInt = parseInt(e.target.value)
        if (parsedInt) setReservationNumber(parsedInt)
        else setError('Неверный номер брони')
    }

    // Получение свойств для выбора в селекторе
    const reservationFilterOptions = useSelector(state => state.reservation.filterOptions)

    const getFilteredReservations = () => {
        e.preventDefault()
        
        dispatch(fetchFilteredReservations(date, auditoriumTitle, playTitle,
             showLocked, reservationNumber))
    }

    return (
        <div>
            <Select onChange={syncDate}>
                <option value="None">Все даты</option>

                {reservationFilterOptions.dates && reservationFilterOptions.dates.map(item => (
                  <option value={item.date}>
                    {item.extended_date}
                  </option>  
                ))}
            </Select>

            <Select onChange={syncAuditoriumTitle}>
                <option value="None">Все залы</option>

                {reservationFilterOptions.auditoriums && reservationFilterOptions.auditoriums
                    .map(item => (
                        <option value={item.title}>
                            {item.title}
                        </option>
                ))}
            </Select>

            <Select onChange={syncPlayTitle}>
                <option value="None">Все спектакли</option>

                {reservationFilterOptions.plays && reservationFilterOptions.plays.map(item => (
                    <option value={item.title}>
                        {item.title}
                    </option>
                ))}   
            </Select>

            <Select onChange={syncShowLocked} >
                <option value="None">Все брони</option>
                <option value={true}>Закрытые</option>
                <option value={false}>Открытые</option>
            </Select>

            <CustomInput description={'Номер брони'} onChange={syncReservationNumber} />

            {
                error !== ''
                ? <ErrorMessage text={error} />
                : null
            }

            <CustomButton type="submit" value="Подтвердить" onClickHook={getFilteredReservations} />
        </div>
    )
}

export default ReservationFilter