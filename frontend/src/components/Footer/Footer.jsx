import React from 'react'
import CustomExternalLink from '../UI/CustomExternalLink/CustomExternalLink'

function Footer() {
    return (
        <div className='my-1 w-[99%] pl-[30px] flex flex-col justify-center items-center text-[18px]'>
            <div className='text-center'>Театр на Оборонной</div>
            <div className='w-[400px] mt-3 flex flex-col sm:flex-row sm:justify-between'>
                <CustomExternalLink destination={"http://teatrnaoboronny.ru"} text={'Главный сайт'} />
                <CustomExternalLink destination={"http://vk.com"} text={'Группа ВКонтакте'} />
            </div>
        </div>
    )
}

export default Footer