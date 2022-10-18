import React from 'react'
import CustomLink from '../UI/CustomLink/CustomLink'
import IconSVG from '../UI/IconSVG/IconSVG'

function Header({ title }) {
  return (
    <div className='flex flex-row w-[100] bg-[#f1e1f5]'>
        <h2>{title}</h2>
        <nav className="ml-4 flex flex-row items-center justify-center">
            <div className='flex flex-row justify-start'>
                <div className='mr-2'>
                    <IconSVG data="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
                </div>
                <CustomLink destination="/" text="Главная"  />
            </div>
            <div className='flex flex-row justify-start'>
                <div className='mr-2'>
                    <IconSVG data="M4,15H6A2,2 0 0,1 8,17V19H9V17A2,2 0 0,1 11,15H13A2,2 0 0,1 15,17V19H16V17A2,2 0 0,1 18,15H20A2,2 0 0,1 22,17V19H23V22H1V19H2V17A2,2 0 0,1 4,15M11,7L15,10L11,13V7M4,2H20A2,2 0 0,1 22,4V13.54C21.41,13.19 20.73,13 20,13V4H4V13C3.27,13 2.59,13.19 2,13.54V4A2,2 0 0,1 4,2Z" />
                </div>
                <CustomLink destination="/repertoire" text="Репертуар"  />
            </div>
            <div className='flex flex-row justify-start'>
                <div className='mr-2'>
                    <IconSVG data="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z" />
                </div>
                <CustomLink destination="/schedule" text="Афиша"  />
            </div>
            <div className='flex flex-row justify-start'>
                <div className='mr-2'>
                    <IconSVG data="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" />
                </div>
                <CustomLink destination="/register" text="Регистрация"  />
            </div>
            <div className='flex flex-row justify-start'>
                <div className='mr-2'>
                    <IconSVG data="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
                </div>
                <CustomLink destination="/login" text="Войти"  />
            </div>
        </nav>  
    </div>
  )
}

export default Header