import React from 'react'
import CustomExternalLink from '../UI/CustomExternalLink/CustomExternalLink'
import mainLogo from '../../assets/index-logo.png'

function Footer() {
    return (
        <div className='mt-1 w-[100%] h-[100%]  px-3 sm:pl-[30px] 
                        flex flex-col justify-center items-center text-[18px] 
                        shadow-xl rounded-md bg-[#f1e1f5]'>
            <div className='w-[100%] sm:w-[400px] mt-3 
                            flex flex-col sm:flex-row 
                            justiy-center items-center sm:justify-between'>
                <CustomExternalLink destination={"http://teatrnaoboronny.ru"} text={'Главный сайт'} />
                <CustomExternalLink destination={"https://vk.com/teatr_ru"} text={'Группа ВК'} />
            </div>
            <div className='mt-2 flex flex-col sm:flex-row justify-center items-center'>
                <div className='relative border border-solid  rounded-full'>
                    <img className="rounded-full w-[65px] sm:w-[35px] h-[65px] sm:h-[35px]" layout="fill" objectFit="cover" 
                                    src={mainLogo} alt="Главное лого"  />
                </div>
                <span className='mt-1 sm:ml-2 text-[15px]'>© 2022 Луганский академический украинский музыкально-драматический театр на Оборонной </span>
            </div>
            
        </div>
    )
}

export default Footer