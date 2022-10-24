import React, { useState, useEffect } from 'react'
import Select from '../../UI/Select/Select'
import CustomButton from '../../UI/CustomButton/CustomButton'
import CustomInput from "../../UI/CustomInput/CustomInput"
import { useDispatch, useSelector} from 'react-redux'
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage'
import { fetchFilteredReservations, fetchReservationFilterOptions } from '../../../store/actions/reservationAction'
import InputDate from '../../UI/InputDate/InputDate'
import { reservationReducer } from '../../../store/reducers/reservationReducer'


function ReservationFilter() {
    const dispatch = useDispatch()
    const token = useSelector(state => state.user.token)
    let errorReservation = useSelector(state => state.reservation.error)

    // Состояния фильтра
    let [dateFrom, setDateFrom] = useState('undefined')
    let [dateTo, setDateTo] = useState('undefined')
    let [auditoriumTitle, setAuditoriumTitle] = useState('undefined')
    let [playTitle, setPlayTitle] = useState('undefined')
    let [reservationNumber, setReservationNumber] = useState('undefined')
    let [showLocked, setShowLocked] = useState('undefined')
    let [error, setError] = useState(null)

    useEffect(() => {
        dispatch(fetchReservationFilterOptions({ token }))
    }, [dispatch, token])

    // Функции для синронизации состояния с input`ами
    const syncDateFrom = (e) => {
        if (!e.target.value) setDateFrom('undefined')
        else setDateFrom(e.target.value)
    }
    const syncDateTo = (e) => {
        if (!e.target.value) setDateTo('undefined')
        else setDateTo(e.target.value)
    }
    const syncAuditoriumTitle = (e) => {
        if (e.target.value === 'None') setAuditoriumTitle('undefined')
        else setAuditoriumTitle(e.target.value)
    }

    const syncPlayTitle = (e) => {
        if (e.target.value === 'None') setPlayTitle('undefined')
        else setPlayTitle(e.target.value)
    }
    const syncShowLocked = (e) => {
        if (e.target.value === 'None')  setShowLocked('undefined')
        else if (e.target.value === 'true') setShowLocked(true)
        else if (e.target.value === 'false') setShowLocked(false)
    }

    const syncReservationNumber = (e) => {
        setTimeout(() => {
            const parsedInt = parseInt(e.target.value)

            if (e.target.value === '') {
                setError(null)
                setReservationNumber('undefined')
                return
            }

            if (parsedInt <= 0 ) {
                setReservationNumber('undefined')
                setError("Значение должно быть больше нуля")
            }
            else if (isNaN(parsedInt)) {
                setReservationNumber('undefined')
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

        dispatch(fetchFilteredReservations({ token, dateFrom, dateTo, auditoriumTitle, playTitle, 
            isLocked: showLocked, idReservation: reservationNumber }))
        if (errorReservation) {
            setError(errorReservation)
            dispatch(reservationReducer.actions.clearError())
        }
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
        <div className="mx-auto p-2 bg-[#f1e1f5]
                bg-[#f1e1f5] shadow-xl
                flex flex-col flex-wrap
                w-[max-content] lg:w-[1000px] 
                justify-center items-center
                rounded-lg">

            <div className='lg:ml-[75px] w-[90%] flex flex-col justify-between
                lg:grid lg:grid-cols-3 lg:gap-y-2 lg:gap-x-1 align-center'>
                <InputDate onChange={syncDateFrom} description={'От даты'} />
                <InputDate onChange={syncDateTo} description={'До даты'}/>
                <CustomInput description={'Номер брони'} onChange={syncReservationNumber}
                    type="number" inputStyleClass="w-[200px]" min="1" />
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
                
                {
                    error !== null && <ErrorMessage text={error} />
                }

            </div>
            <div className='lg:ml-[90px] mt-2 w-[200px]'>
                <CustomButton value="Фильтр" onClickHook={getFilteredReservations} />
            </div>
        
        </div>
    )
}

export default ReservationFilter