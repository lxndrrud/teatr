import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from "../../CustomButton/CustomButton"
import DateString from "../../DateString/DateString"
import { fetchFilteredSessions, fetchSessionFilterOptions } from "../../../store/actions/sessionAction"

const SessionFilter = () => {
    const dispatch = useDispatch()
    let [date, setDate] = useState('')
    let [auditoriumTitle, setAuditoriumTitle] = useState('')
    let [playTitle, setPlayTitle] = useState('')
    useEffect(() => {
        dispatch(fetchSessionFilterOptions())
    }, [])
    const getFilteredSessions = (e) => {
        e.preventDefault()

        dispatch(fetchFilteredSessions(date, auditoriumTitle, playTitle))
    } 

    const syncDate = (e) => {
        setDate(e.target.value)
    }

    const syncAuditoriumTitle = (e) => {
        setAuditoriumTitle(e.target.value)
    }

    const syncPlayTitle = (e) => {
        setPlayTitle(e.target.value)
    }

    const filterOptions = useSelector(state => state.session.filterOptions)
    console.log(filterOptions)

    return (
        <div>
            <select onChange={syncDate}>
                <option>Дата</option>
                {filterOptions.dates && filterOptions.dates.map(item => (
                  <option value={item.date}>
                    {item.date}
                  </option>  
                ))}
            </select>
            <select onChange={syncAuditoriumTitle}>
                <option>Название зала</option>
                {filterOptions.auditoriums && filterOptions.auditoriums.map(item => (
                    <option value={item.title}>
                        {item.title}
                    </option>
                ))}
            </select>
            <select onChange={syncPlayTitle}>
                <option>Название спектакля</option>

                {filterOptions.plays && filterOptions.plays.map(item => (
                    <option value={item.title}>
                        {item.title}
                    </option>
                ))}   
            </select>
            <CustomButton type="submit" value="Подтвердить" onClickHook={getFilteredSessions} />
        </div>
    )
}

export default SessionFilter