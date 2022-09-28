import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from "../../UI/CustomButton/CustomButton"
import Select from '../../UI/Select/Select'
import { fetchFilteredSessions, fetchSessionFilterOptions } from "../../../store/actions/sessionAction"
import InputDate from '../../UI/InputDate/InputDate'
import { usePreloader } from '../../../hooks/usePreloader'

function SessionFilter() {
    const dispatch = useDispatch()
    let [dateFrom, setDateFrom] = useState('')
    let [dateTo, setDateTo] = useState('')
    let [auditoriumTitle, setAuditoriumTitle] = useState('')
    let [playTitle, setPlayTitle] = useState('')
    useEffect(() => {
        dispatch(fetchSessionFilterOptions())
    }, [dispatch])
    const getFilteredSessions = (e) => {
        e.preventDefault()

        usePreloader(dispatch, fetchFilteredSessions(dateFrom, dateTo, auditoriumTitle, playTitle))
    } 

    /*
    const syncdateFrom = (e) => {
        if (e.target.value === 'None') setDateFrom('')
        else setDateFrom(e.target.value)
    }
    */
    const syncDateFrom = (e) => {
        if (!e.target.value) setDateFrom()
        else setDateFrom(e.target.value)
    }

    const syncDateTo = (e) => {
        if (!e.target.value) setDateTo()
        else setDateTo(e.target.value)
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
    <Select onChange={syncdateFrom}>
                <option value="None">Все даты</option>
                {filterOptions.dateFroms && filterOptions.dateFroms.map(item => (
                  <option value={item.dateFrom}>
                    {item.extended_dateFrom}
                  </option>  
                ))}
            </Select>
    */
    return (
        <div className="mx-auto p-2 w-[max-content] sm:w-[50%] lg:w-[900px]
            bg-[#f1e1f5] shadow-xl flex flex-col
            justify-between lg:justify-between items-center
            flex-nowrap sm:flex-wrap rounded-lg">
            
            <div className='flex flex-col justify-between
                lg:grid lg:grid-cols-2 lg:gap-y-2 lg:gap-x-3'>
                <InputDate onChange={syncDateFrom} description='От даты' />
                    <InputDate onChange={syncDateTo} description='До даты' />
                
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
                </div>
            
            <div className='mt-2'>
                <CustomButton 
                    value="Фильтр" 
                    onClickHook={getFilteredSessions}  
                    styleClass="flex mt-[1%]"
                />
            </div>
            
        </div>
    )
}

export default SessionFilter