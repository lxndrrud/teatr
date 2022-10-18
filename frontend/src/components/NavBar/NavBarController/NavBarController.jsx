import React, { useState, useEffect } from 'react'
//import { useRouter } from 'next/router'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { checkLogin } from "../../../middlewares/authFunctions"
import CustomButton from '../../UI/CustomButton/CustomButton'
import CustomLink from '../../UI/CustomLink/CustomLink'
// import { toggleNavbar } from "../../../store/actions/designAction"
import { designReducer } from '../../../store/reducers/designReducer'
//import Image from 'next/image'
import styles from "../NavBar.module.css"
import mainLogo from "../../../assets/index-logo.png"
import { userReducer } from '../../../store/reducers/userReducer'
import IconSVG from '../../UI/IconSVG/IconSVG'
import { useNavigate } from 'react-router-dom'


const NavBarController = () => {
    let { navbarIsHidden: isHidden} = useSelector(state => state.design)
    const store = useStore()
    let navigate = useNavigate()
    //const router = useRouter()
    const dispatch = useDispatch()

    // Actions
    const { toggleNavbar } = designReducer.actions

    let token= useSelector(state => state.user.token)
    let isAdmin = useSelector(state => state.user.isAdmin)
    let [isLoggedIn, setIsLoggedIn] = useState(checkLogin(store))

    const logOutOnClick = (e) => {
        e.preventDefault()
        dispatch(userReducer.actions.logOut())
        setIsLoggedIn(checkLogin(store))
        navigate('/')
            /*if (router.isReady) {
                router.push('/')
            }*/
    }
    useEffect(() => {
        setIsLoggedIn(checkLogin(store))
    }, [store, token])
    return (
        <div className={styles.fixedContainer}>
        {
            isHidden
            ?
               <button onClick={() => { if (isHidden) dispatch(toggleNavbar()) }}>
                    <IconSVG data="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" 
                        height={"48px"} width={"48px"} />
               </button>
            :
                
                <div>
                    { 
                        !isLoggedIn
                        ? (
                            <nav className={styles.navLinks}>
                                <button onClick={() => { if(!isHidden) dispatch(toggleNavbar()) }} >
                                    <IconSVG data="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                                         height={"48px"} width={"48px"} />
                                </button>
                                <div className={styles.logoContainer}>
                                    <img className={styles.logoPicture } layout="fill" objectFit="cover" 
                                        src={mainLogo} alt="Главное лого"  />
                                </div>
                                <div className={styles.linksContainer} >
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
                                </div>
                            </nav>  
                            
                        )
                        : (
                            <nav className={styles.navLinks}>
                                <button onClick={() => { dispatch(toggleNavbar()) }} >
                                    <IconSVG data="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                                        height={"48px"} width={"48px"} />
                                </button>
                                <div className={styles.logoContainer}>
                                    <img className={styles.logoPicture } layout="fill" objectFit="cover" 
                                        src={mainLogo} alt="Главное лого"  />
                                </div>
                                <div className={styles.linksContainer} >
                                    <div className='flex flex-row justify-start'>
                                        <div className='mr-2'>
                                            <IconSVG data="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
                                        </div>
                                        <CustomLink destination="/" text="Главная"  />
                                    </div>
                                    {
                                        isAdmin 
                                        && 
                                        <div className='flex flex-row justify-start'>
                                            <div className='mr-2'>
                                                <IconSVG data="M20 22H4V20C4 17.8 7.6 16 12 16S20 17.8 20 20M8 9H16V10C16 12.2 14.2 14 12 14S8 12.2 8 10M19 4C18.4 4 18 4.4 18 5V6H16.5L15.1 3C15 2.8 14.9 2.6 14.7 2.5C14.2 2 13.4 1.9 12.7 2.2L12 2.4L11.3 2.1C10.6 1.8 9.8 1.9 9.3 2.4C9.1 2.6 9 2.8 8.9 3L7.5 6H6V5C6 4.4 5.6 4 5 4S4 4.4 4 5V6C4 7.1 4.9 8 6 8H18C19.1 8 20 7.1 20 6V5C20 4.5 19.6 4 19 4Z" />
                                            </div>
                                            <CustomLink destination="/reservation-admin" text="Админка" />
                                        </div>
                                    }
                                    <div className='flex flex-row justify-start'>
                                        <div className='mr-2'>
                                            <IconSVG data="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                                        </div>
                                        <CustomLink destination="/user/personalArea" text="Аккаунт" />
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
                                            <IconSVG data="M4,4A2,2 0 0,0 2,6V10A2,2 0 0,1 4,12A2,2 0 0,1 2,14V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V14A2,2 0 0,1 20,12A2,2 0 0,1 22,10V6A2,2 0 0,0 20,4H4M4,6H20V8.54C18.76,9.25 18,10.57 18,12C18,13.43 18.76,14.75 20,15.46V18H4V15.46C5.24,14.75 6,13.43 6,12C6,10.57 5.24,9.25 4,8.54V6Z" />
                                        </div>
                                        <CustomLink destination="/control" text="Брони" />
                                    </div>
                                    
                                    <CustomButton type="submit" value="Выйти" 
                                        onClickHook={logOutOnClick}
                                        styleClass={styles.logOutButton}/>
                                </div>
                            </nav>
                        )
                    }
                </div>
        }
        </div>
    )
}

export default NavBarController