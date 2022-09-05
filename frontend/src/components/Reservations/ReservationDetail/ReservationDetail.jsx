import React from 'react'
import ButtonLink from "../../UI/ButtonLink/ButtonLink"
import ReservationSlotList from '../../Slots/ReservationSlotList/ReservationSlotList'
import TooltipButton from '../../UI/TooltipButton/TooltipButton'
import CustomLink from '../../UI/CustomLink/CustomLink'

function ReservationDetail({ reservation }) {
    return (
        <div className="md:mx-auto md:w-[85%] p-2 md:p-5 flex flex-col md:flex-row flex-wrap justify-between 
                        bg-[#eeeeee] rounded-md shadow-xl hover:shadow-2xl hover:transition-[box-shadow 0.5s]">
                <div className="flex flex-col">
                    <table className="flex justify-between">
                        <tbody>
                            <tr>
                                <td><span className="font-bold">Номер брони</span></td>
                                <td>{reservation.id}</td>
                            </tr>
                            <tr>
                                <td><span className="font-bold">Название спектакля</span></td>
                                <td> 
                                    <CustomLink text={reservation.play_title} 
                                        destination={`/repertoire/${reservation.id_play}`}/>
                                </td>
                            </tr>
                            <tr>
                                <td><span className="font-bold">Зал</span></td>
                                <td>{reservation.auditorium_title}</td>
                            </tr>
                            <tr>
                                <td><span className="font-bold">Время сеанса</span></td>
                                <td>{reservation.session_timestamp}</td>
                            </tr>
                            <tr>
                                <td><span className="font-bold">Время бронирования</span></td>
                                <td>{reservation.created_at}</td>
                            </tr>
                            <tr>
                                <td><span className="font-bold">Статус подтверждения</span></td>
                                <td className='flex flex-row'>
                                    {
                                        reservation.is_confirmed
                                            ? <span className="text-[#4a7140]">Подтверждено</span>
                                            : <span className="text-[#e41220]">Не подтверждено</span>
                                    }
                                    &nbsp;
                                    <TooltipButton 
                                        tooltipText="Неподтвержденные брони удаляются через 15 минут после создания!"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><span className="font-bold">Статус оплаты</span></td>
                                <td className='flex flex-row'>
                                    {
                                        reservation.is_paid
                                            ? <span className="text-[#4a7140]">Оплачено</span>
                                            : <span className="text-[#e41220]">Не оплачено</span>
                                    }
                                    &nbsp;
                                    <TooltipButton 
                                        tooltipText="Неоплаченные брони удаляются за 15 минут до начала сеанса!"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><span className="font-bold">Стоимость</span></td>
                                <td>{reservation.total_cost} рублей</td>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>
                
                <div className="flex flex-col">
                    <ReservationSlotList slots={reservation.slots} />
                    {
                        reservation.can_user_confirm
                        ? <ButtonLink
                            linkType="green" 
                            text='Подтвердить бронь' 
                            destination={`/confirm/${reservation.id}`} />
                        : null
                    }
                    {
                        reservation.can_user_pay
                        ? <ButtonLink 
                            linkType="green"
                            text='Пометить оплаченной' 
                            destination={`/control/payment/${reservation.id}`} />
                        : null
                    }
                    {
                        reservation.can_user_delete
                        ? <ButtonLink 
                            text='Удалить бронь' 
                            linkType = "red"
                            destination={`/control/delete/${reservation.id}`} />
                        : null
                    }
                </div>
            </div>
    )
}

export default ReservationDetail