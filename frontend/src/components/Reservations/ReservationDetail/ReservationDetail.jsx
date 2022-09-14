import React from 'react'
import ButtonLink from "../../UI/ButtonLink/ButtonLink"
import ReservationSlotList from '../../Slots/ReservationSlotList/ReservationSlotList'
import TooltipButton from '../../UI/TooltipButton/TooltipButton'
import CustomLink from '../../UI/CustomLink/CustomLink'

function ReservationDetail({ reservation }) {
    return (
        <div className="mx-auto mt-3 w-[min-content] md:w-[85%] p-1 md:p-5 
                        flex flex-col md:flex-row flex-wrap justify-between 
                        bg-[#eeeeee] rounded-md shadow-xl
                        text-[14px] sm:text-[18px]">
                <div className="w-[min-content] lg:w-[700px] flex flex-col">
                    <table className='border-separate border-2 border-solid rounded-md'>
                        <tbody>
                            <tr>
                                <td className="p-1 border-l-[none] border-t-[none]"><span className="font-bold">Номер брони</span></td>
                                <td className="p-1 border-l-[2px] border-t-[none]">{reservation.id}</td>
                            </tr>
                            <tr>
                                <td className="p-1 border-l-[none] border-t-[2px]"><span className="font-bold">Название спектакля</span></td>
                                <td className="p-1 border-l-[2px] border-t-[2px]"> 
                                    <CustomLink text={reservation.play_title} 
                                        destination={`/repertoire/${reservation.id_play}`}/>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-1 border-l-[none] border-t-[2px]"><span className="font-bold">Зал</span></td>
                                <td className="p-1 border-l-[2px] border-t-[2px]">{reservation.auditorium_title}</td>
                            </tr>
                            <tr>
                                <td className="p-1 border-l-[none] border-t-[2px]"><span className="font-bold">Время сеанса</span></td>
                                <td className="p-1 border-l-[2px] border-t-[2px]">{reservation.session_timestamp}</td>
                            </tr>
                            <tr>
                                <td className="p-1 border-l-[none] border-t-[2px]"><span className="font-bold">Время бронирования</span></td>
                                <td className="p-1 border-l-[2px] border-t-[2px]">{reservation.created_at}</td>
                            </tr>
                            <tr>
                                <td className="p-1 border-l-[none] border-t-[2px]"><span className="font-bold">Статус подтверждения</span></td>
                                <td className='p-1 flex flex-row border-l-[2px] border-t-[2px]'>
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
                                <td className="p-1 border-l-[none] border-t-[2px]"><span className="font-bold">Статус оплаты</span></td>
                                <td className='p-1 flex flex-row border-l-[2px] border-t-[2px]'>
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
                                <td className="p-1 border-l-[none] border-t-[2px]"><span className="font-bold">Стоимость</span></td>
                                <td className="p-1 border-l-[2px] border-t-[2px]">{reservation.total_cost} рублей</td>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>
                
                <div className="mt-3 2xl:mt-0 flex flex-col">
                    <ReservationSlotList slots={reservation.slots} />
                    <div className="flex flex-col">
                        {
                            reservation.can_user_confirm
                            ? 
                            <div className="mt-1">
                                <ButtonLink
                                    linkType="green" 
                                    text='Подтвердить бронь' 
                                    destination={`/confirm/${reservation.id}`} />
                            </div>
                            : null
                        }
                        {
                            reservation.can_user_pay
                            ? 
                            <div className="mt-1">
                                <ButtonLink 
                                    linkType="green"
                                    text='Пометить оплаченной' 
                                    destination={`/control/payment/${reservation.id}`} />
                            </div>
                            : null
                        }
                        {
                            reservation.can_user_delete
                            ? 
                            <div className="mt-1">
                                <ButtonLink 
                                    text='Удалить бронь' 
                                    linkType = "red"
                                    destination={`/control/delete/${reservation.id}`} />
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
    )
}

export default ReservationDetail