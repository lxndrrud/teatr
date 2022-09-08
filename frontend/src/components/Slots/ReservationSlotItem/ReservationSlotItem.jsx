import React from 'react'

function ReservationSlotItem({ slot }) {
    return (
        <li className="p-3 mt-3 mr-2 max-w-[300px] min-w-[100px]
                        flex flex-col bg-[#f1faee] 
                        border border-solid border-[black] rounded-md" key={slot.id}>
            <table className='text-[16px]'>
                <tbody>
                    <tr className="border-b-[1px] border-solid">
                        <td className='font-bold'>Название ряда</td>
                        <td className="pl-2">{slot.row_title}</td>
                    </tr>
                    <tr className="border-b-[1px] border-solid">
                        <td className='font-bold'>Номер ряда</td>
                        <td className="pl-2">{slot.row_number}</td>
                    </tr>
                    <tr className="border-b-[1px] border-solid">
                        <td className='font-bold'>Номер места</td>
                        <td className="pl-2">{slot.seat_number}</td>
                    </tr>
                    <tr>
                        <td className='font-bold'>Цена</td>
                        <td className="pl-2">{slot.price} рублей</td>
                    </tr>
                </tbody>
            </table>
        </li>
    )
}

export default ReservationSlotItem