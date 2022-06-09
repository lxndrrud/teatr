import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { checkLogin } from "../../../middlewares/auth"
import CustomButton from '../../UI/CustomButton/CustomButton'
import { CustomLink } from '../../UI/CustomLink/CustomLink'
import { Button } from "react-bootstrap"
import { toggleNavbar } from "../../../store/actions/designAction"
import Image from 'next/image'
import styles from "./NavBarController.module.css"
import mainLogo from "../../../storage/index-logo.png"
import { logOut } from "../../../store/actions/userAction"
/*import menuIcon from "../../../storage/menu.png"
import closeIcon from "../../../storage/close.png"*/


const NavBarController = () => {
    let isHidden = useSelector(state => state.design.navbarIsHidden)
    const store = useStore()
    const router = useRouter()
    const dispatch = useDispatch()

    let [token, setToken] = useState(useSelector(state => state.user.token))
    let [isLoggedIn, setIsLoggedIn] = useState(checkLogin(store))

    const logOutOnClick = (e) => {
        e.preventDefault()
        dispatch(logOut())
        .then(() => {
            setToken('')
            if (router.isReady) {
                router.push('/')
            }
        })
    }
    useEffect(() => {
        if (checkLogin(store))
            setIsLoggedIn(true)
        else
            setIsLoggedIn(false)
        
    }, [token])
    return (
        <div className={styles.fixedContainer}>
        {
            isHidden
            ?
               <Button onClick={() => { if (isHidden) dispatch(toggleNavbar()) }}>
                    <svg style={{width: "48px", height: "48px"}} viewBox="0 0 24 24">
                        <path fill="#000" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
                    </svg>
               </Button>
            :
                
                <div>
                    { 
                        !isLoggedIn
                        ? (
                            <nav className={styles.navLinks}>
                                <Button onClick={() => { if(!isHidden) dispatch(toggleNavbar()) }} >
                                    <svg style={{width: "48px", height: "48px"}} viewBox="0 0 24 24">
                                        <path fill="#000" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                    </svg>
                                </Button>
                                <div className={styles.logoContainer}>
                                    <Image className={styles.logoPicture } layout="fill" objectFit="cover" 
                                        src={mainLogo} alt="Главное лого"  />
                                </div>
                                <div className={styles.linksContainer} >
                                    <CustomLink destination="/" text="Главная"  />
                                    <CustomLink destination="/repertoire" text="Репертуар"  />
                                    <CustomLink destination="/schedule" text="Расписание"  />
                                    <CustomLink destination="/register" text="Регистрация"  />
                                    <CustomLink destination="/login" text="Войти"  />
                                </div>
                            </nav>  
                            
                        )
                        : (
                            <nav className={styles.navLinks}>
                                <Button onClick={() => { dispatch(toggleNavbar()) }} >
                                    <svg style={{width: "48px", height: "48px"}} viewBox="0 0 24 24">
                                        <path fill="#000" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                    </svg>
                                </Button>
                                <div className={styles.logoContainer}>
                                    <Image className={styles.logoPicture } layout="fill" objectFit="cover" 
                                        src={mainLogo} alt="Главное лого"  />
                                </div>
                                <div className={styles.linksContainer} >
                                    <span>
                                        <svg style={{ width:"24px", height:"24px", viewBox: "0 0 24 24", float: "left", marginRight: "10px"}}>
                                            <path fill="#000" d="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z" />
                                        </svg>
                                        <CustomLink destination="/" text="Главная"  />
                                    </span>
                                    <span>
                                        <svg style={{ width:"24px", height:"24px", viewBox: "0 0 24 24", float: "left", marginRight: "10px"}}>
                                            <path fill="#000" d="M4,15H6A2,2 0 0,1 8,17V19H9V17A2,2 0 0,1 11,15H13A2,2 0 0,1 15,17V19H16V17A2,2 0 0,1 18,15H20A2,2 0 0,1 22,17V19H23V22H1V19H2V17A2,2 0 0,1 4,15M11,7L15,10L11,13V7M4,2H20A2,2 0 0,1 22,4V13.54C21.41,13.19 20.73,13 20,13V4H4V13C3.27,13 2.59,13.19 2,13.54V4A2,2 0 0,1 4,2Z" />
                                        </svg>
                                        <CustomLink destination="/repertoire" text="Репертуар"  />
                                    </span>
                                    <span>
                                        <svg style={{ width:"24px", height:"24px", viewBox: "0 0 24 24", float: "left", marginRight: "10px"}}>
                                            <path fill="#000" d="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z" />
                                        </svg>
                                        <CustomLink destination="/schedule" text="Расписание"  />
                                    </span>
                                    <span>
                                        <svg style={{ width:"24px", height:"24px", viewBox: "0 0 24 24", float: "left", marginRight: "10px"}}>
                                            <path fill="#000" d="M4,4A2,2 0 0,0 2,6V10A2,2 0 0,1 4,12A2,2 0 0,1 2,14V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V14A2,2 0 0,1 20,12A2,2 0 0,1 22,10V6A2,2 0 0,0 20,4H4M4,6H20V8.54C18.76,9.25 18,10.57 18,12C18,13.43 18.76,14.75 20,15.46V18H4V15.46C5.24,14.75 6,13.43 6,12C6,10.57 5.24,9.25 4,8.54V6Z" />
                                        </svg>
                                        <CustomLink destination="/control" text="Брони" />
                                    </span>

                                    
                                   
                                    
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