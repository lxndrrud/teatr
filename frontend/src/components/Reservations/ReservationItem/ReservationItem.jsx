import { Card } from "react-bootstrap"
import ButtonLink from "../../UI/ButtonLink/ButtonLink"
import React from 'react'
import IconSVG from "../../UI/IconSVG/IconSVG"
import CustomLink from "../../UI/CustomLink/CustomLink"

function ReservationItem({ reservation }) {
    const playLink = `/repertoire/${reservation.id_play}`
    return (
        <Card className="w-[min-content] sm:w-[max-content] lg:w-[30%] flex flex-col rounded-md
                         border border-solid border-[black] 
                         border-t-[none] 
                         bg-[#eeeeee] mr-[2%] mt-[20px] 
                         shadow-xl hover:shadow-2xl 
                         text-[16px] sm:text-[auto]">
            {
                !reservation.session_is_locked
                ? 
                    <Card.Header className={`border border-solid 
                                            border-[black] 
                                            py-[2%] pl-[3%] pr-[2%]
                                            rounded-tl-md rounded-tr-md  
                                            text-[#f1faee] bg-[#9239b6]`}>
                        Сеанс еще не состоялся!
                    </Card.Header>
                :   <Card.Header className={`border border-solid 
                                            border-[black] 
                                            py-[2%] pl-[3%] pr-[2%] 
                                            rounded-tl-md rounded-tr-md 
                                            text-[#f1faee] bg-[#cc183f]`}>
                        Сеанс состоялся!
                    </Card.Header>
            }
            <Card.Body className="flex flex-col justify-between
                                px-[2%] py-[3%] rounded-md">
                <table>
                <tbody>
                    <tr className="border-b-[1px] border-solid">
                        <td className="pt-[5px] pr-[5px]">
                            <div className="flex flex-row justify-start">
                                <div className="mr-2">
                                    <IconSVG data="M15.58,16.8L12,14.5L8.42,16.8L9.5,12.68L6.21,10L10.46,9.74L12,5.8L13.54,9.74L17.79,10L14.5,12.68M20,12C20,10.89 20.9,10 22,10V6C22,4.89 21.1,4 20,4H4A2,2 0 0,0 2,6V10C3.11,10 4,10.9 4,12A2,2 0 0,1 2,14V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V14A2,2 0 0,1 20,12Z" />
                                </div>
                                <strong>Номер брони</strong>
                            </div>
                        </td>
                        <td className="pt-[5px] pr-[5px]">{reservation.id}</td>
                    </tr>
                    <tr className="border-b-[1px] border-solid">
                        <td className="pt-[5px] pr-[5px]">
                            <div className="flex flex-row justify-start">
                                <div className="mr-2">
                                    <IconSVG data="M15,20A1,1 0 0,0 16,19V4H8A1,1 0 0,0 7,5V16H5V5A3,3 0 0,1 8,2H19A3,3 0 0,1 22,5V6H20V5A1,1 0 0,0 19,4A1,1 0 0,0 18,5V9L18,19A3,3 0 0,1 15,22H5A3,3 0 0,1 2,19V18H13A2,2 0 0,0 15,20Z" />
                                </div>
                                <strong>Название спектакля</strong>
                            </div>
                        </td>
                        <td className="pt-[5px] pr-[5px]">
                            <CustomLink text={reservation.play_title} destination={playLink} />
                        </td>
                    </tr>
                    <tr className="border-b-[1px] border-solid">
                        <td className="pt-[5px] pr-[5px]">
                            <div className="flex flex-row justify-start">
                                <div className="mr-2">
                                    <IconSVG data="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
                                </div>
                                <strong>Зал</strong>
                            </div>
                        </td>
                        <td className="pt-[5px] pr-[5px]">{reservation.auditorium_title}</td>
                    </tr>
                    <tr className="border-b-[1px] border-solid">
                        <td className="pt-[5px] pr-[5px]">
                            <div className="flex flex-row justify-start">
                                <div className="mr-2">
                                    <IconSVG data="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                                </div>
                                <strong>Время сеанса</strong>
                            </div>
                        </td>
                        <td className="pt-[5px] pr-[5px]">{reservation.session_timestamp}</td>
                    </tr>
                    <tr>
                        <td className="pt-[5px] pr-[5px]">
                            <div className="flex flex-row justify-start">
                                <div className="mr-2">
                                    <IconSVG data="M4,18V21H7V18H17V21H20V15H4V18M19,10H22V13H19V10M2,10H5V13H2V10M17,13H7V5A2,2 0 0,1 9,3H15A2,2 0 0,1 17,5V13Z" />
                                </div>
                                <strong>Количество мест</strong>
                            </div>
                        </td>
                        <td className="pt-[5px] pr-[5px]">{reservation.slots.length}</td>
                    </tr>
                    
                </tbody>
                </table>
                <ButtonLink destination={`/control/${reservation.id}`} text="Подробнее" 
                    linkType="green"/>
            </Card.Body>

        </Card>
    )
}

export default ReservationItem