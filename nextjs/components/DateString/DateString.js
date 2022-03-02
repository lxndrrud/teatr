import React from 'react'

const DateString = ({ date, styleClass }) => {
    // Postgresql YYYY-MM-DD is being formatted to DD.MM.YYYY
    const formattedDate = `${date.split('-')[2]}.${date.split('-')[1]}.${date.split('-')[0]}`
    return (
        <span className={styleClass}>{formattedDate}</span>
    )
}

export default DateString