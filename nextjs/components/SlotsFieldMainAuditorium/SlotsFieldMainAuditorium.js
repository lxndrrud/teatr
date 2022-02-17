import React from 'react'

const SlotsFieldMainAuditorium = ({ rows }) => {
  return (
    <table>
        {rows.map(row => (
            <tr>
                {row.seats.map(seat => {
                    <td>
                        <span>{ seat.value }</span> 
                    </td>
                })}
            </tr>
        ))}
    </table>
  )
    
}

export default SlotsFieldMainAuditorium