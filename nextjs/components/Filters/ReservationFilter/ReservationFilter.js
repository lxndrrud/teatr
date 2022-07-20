import React, { useState, useEffect } from 'react'
import Select from '../../UI/Select/Select'
import CustomButton from '../../UI/CustomButton/CustomButton'
import CustomInput from "../../UI/CustomInput/CustomInput"
import styles from "./ReservationFilter.module.css"
import { useDispatch, useSelector} from 'react-redux'
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'
import { fetchFilteredReservations, fetchReservationFilterOptions } from '../../../store/actions/reservationAction'
import InputDate from '../../UI/InputDate/InputDate'

const ReservationFilter = () => {
    const dispatch = useDispatch()
    const token = useSelector(state => state.user.token)

    // Состояния фильтра
    let [date, setDate] = useState()
    let [auditoriumTitle, setAuditoriumTitle] = useState()
    let [playTitle, setPlayTitle] = useState()
    let [reservationNumber, setReservationNumber] = useState()
    let [showLocked, setShowLocked] = useState()
    let [error, setError] = useState(null)

    useEffect(() => {
        dispatch(fetchReservationFilterOptions(token))
    }, [dispatch, token])

    // Функции для синронизации состояния с input`ами
    /*
    const syncDate = (e) => {
        if (e.target.value === 'None') setDate()
        else setDate(e.target.value)
    }
    */

    const syncDate = (e) => {
        if (!e.target.value) setDate()
        else setDate(e.target.value)
    }
    const syncAuditoriumTitle = (e) => {
        if (e.target.value === 'None') setAuditoriumTitle()
        else setAuditoriumTitle(e.target.value)
    }

    const syncPlayTitle = (e) => {
        if (e.target.value === 'None') setPlayTitle()
        else setPlayTitle(e.target.value)
    }
    const syncShowLocked = (e) => {
        if (e.target.value === 'None')  setShowLocked()
        else if (e.target.value === 'true') setShowLocked(true)
        else if (e.target.value === 'false') setShowLocked(false)
    }

    const syncReservationNumber = (e) => {
        setTimeout(() => {
            const parsedInt = parseInt(e.target.value)

            if (e.target.value === '') {
                setError(null)
                setReservationNumber()
                return
            }

            if (parsedInt <= 0 ) {
                setReservationNumber(undefined)
                setError("Значение должно быть больше нуля")
            }
            else if (isNaN(parsedInt)) {
                setReservationNumber(undefined)
                setError('Неверный номер брони')
            }
            else if (parsedInt) {
                setError(null)
                setReservationNumber(parsedInt)
            }
            
        }, 500)
        
    }

    // Получение свойств для выбора в селекторе
    const reservationFilterOptions = useSelector(state => state.reservation.filterOptions)

    const getFilteredReservations = (e) => {
        e.preventDefault()
        
        dispatch(fetchFilteredReservations(token, date, auditoriumTitle, playTitle, 
            showLocked, reservationNumber))
    }

    /*
    <Select onChange={syncDate}>
                <option value="None">Все даты</option>

                {reservationFilterOptions.dates && reservationFilterOptions.dates.map(item => (
                  <option value={item.date} key={item.date} >
                    {item.extended_date}
                  </option>  
                ))}
            </Select>
    */

    return (
        <div className={styles.container}>
            <InputDate onChange={syncDate} />
            <Select onChange={syncAuditoriumTitle}>
                <option value="None">Все залы</option>

                {reservationFilterOptions.auditoriums && reservationFilterOptions.auditoriums
                    .map(item => (
                        <option value={item.title} key={item.id}>
                            {item.title}
                        </option>
                ))}
            </Select>

            <Select onChange={syncPlayTitle}>
                <option value="None">Все спектакли</option>

                {reservationFilterOptions.plays && reservationFilterOptions.plays.map(item => (
                    <option value={item.title} key={item.id}>
                        {item.title}
                    </option>
                ))}   
            </Select>

            <Select onChange={syncShowLocked} >
                <option value="None">Все брони</option>
                <option value="true">Закрытые</option>
                <option value="false">Открытые</option>
            </Select>

            <CustomInput description={'Номер брони'} onChange={syncReservationNumber}
                type="number" inputStyleClass={styles.inputNumber} min="1" />

            {
                error !== null
                ? <ErrorMessage text={error} />
                : null
            }

            <CustomButton type="submit" value="Фильтр" onClickHook={getFilteredReservations} />
        </div>
    )
}

export default ReservationFilter