import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from "../../UI/CustomButton/CustomButton"
import Select from '../../UI/Select/Select'
import { fetchFilteredSessions, fetchSessionFilterOptions } from "../../../store/actions/sessionAction"
import InputDate from '../../UI/InputDate/InputDate'

function SessionFilter() {
    const dispatch = useDispatch()
    let [date, setDate] = useState('')
    let [auditoriumTitle, setAuditoriumTitle] = useState('')
    let [playTitle, setPlayTitle] = useState('')
    useEffect(() => {
        dispatch(fetchSessionFilterOptions())
    }, [dispatch])
    const getFilteredSessions = (e) => {
        e.preventDefault()

        dispatch(fetchFilteredSessions(date, auditoriumTitle, playTitle))
    } 

    /*
    const syncDate = (e) => {
        if (e.target.value === 'None') setDate('')
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

    const filterOptions = useSelector(state => state.session.filterOptions)

    /*
    <Select onChange={syncDate}>
                <option value="None">Все даты</option>
                {filterOptions.dates && filterOptions.dates.map(item => (
                  <option value={item.date}>
                    {item.extended_date}
                  </option>  
                ))}
            </Select>
    */
    return (
        <div className="mx-auto p-2 w-[max-content] sm:w-[50%] lg:w-[900px]
            border-2 border-solid
            bg-[#eeeeee] flex flex-col sm:flex-row
            justify-center items-center
            flex-nowrap sm:flex-wrap rounded-lg">
            <InputDate onChange={syncDate} />
            <Select onChange={syncAuditoriumTitle}>
                <option key="0" value="None">Все залы</option>
                {filterOptions.auditoriums && filterOptions.auditoriums.map(item => (
                    <option key={item.id} value={item.title}>
                        {item.title}
                    </option>
                ))}
            </Select>
            <Select onChange={syncPlayTitle}>
                <option key="0" value="None">Все спектакли</option>

                {filterOptions.plays && filterOptions.plays.map(item => (
                    <option key={item.id} value={item.title}>
                        {item.title}
                    </option>
                ))}   
            </Select>
            <CustomButton 
                value="Фильтр" 
                onClickHook={getFilteredSessions}  
                styleClass="flex mt-[1%]"
            />
        </div>
    )
}

export default SessionFilter