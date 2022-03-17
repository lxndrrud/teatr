import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from "../../CustomButton/CustomButton"
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

    const filterOptions = useSelector(state => state.session.filterOptions)

    return (
        <div>
            <select onChange={syncDate}>
                <option value="None">Все даты</option>
                {filterOptions.dates && filterOptions.dates.map(item => (
                  <option value={item.date}>
                    {item.extended_date}
                  </option>  
                ))}
            </select>
            <select onChange={syncAuditoriumTitle}>
                <option value="None">Все залы</option>
                {filterOptions.auditoriums && filterOptions.auditoriums.map(item => (
                    <option value={item.title}>
                        {item.title}
                    </option>
                ))}
            </select>
            <select onChange={syncPlayTitle}>
                <option value="None">Все спектакли</option>

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