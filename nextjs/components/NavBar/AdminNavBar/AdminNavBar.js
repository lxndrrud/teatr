import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { checkLogin } from "../../../middlewares/auth"
import CustomButton from '../../UI/CustomButton/CustomButton'
import { CustomLink } from '../../UI/CustomLink/CustomLink'
import { Button } from "react-bootstrap"
import { toggleNavbar } from "../../../store/actions/designAction"
import Image from 'next/image'
import styles from "../NavBar.module.css"
import mainLogo from "../../../storage/index-logo.png"
import { logOut } from "../../../store/actions/userAction"
import IconSVG from '../../UI/IconSVG/IconSVG'


const AdminNavBar = () => {
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
                router.push('/reservation-admin/login')
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
                    <IconSVG data="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" 
                        height={"48px"} width={"48px"} />
               </Button>
            :
                
                <div>
                    { 
                        !isLoggedIn
                        ? (
                            <nav className={styles.navLinks}>
                                <Button onClick={() => { if(!isHidden) dispatch(toggleNavbar()) }} >
                                    <IconSVG data="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                                         height={"48px"} width={"48px"} />
                                </Button>
                                <div className={styles.logoContainer}>
                                    <Image className={styles.logoPicture } layout="fill" objectFit="cover" 
                                        src={mainLogo} alt="Главное лого"  />
                                </div>
                                <div className={styles.linksContainer} >
                                    <span>
                                        <IconSVG data="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
                                        <CustomLink destination="/reservation-admin" text="Главная"  />
                                    </span>
                                    <span>
                                        <IconSVG data="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
                                        <CustomLink destination="/reservation-admin/login" text="Войти"  />
                                    </span>
                                </div>
                            </nav>  
                            
                        )
                        : (
                            <nav className={styles.navLinks}>
                                <Button onClick={() => { dispatch(toggleNavbar()) }} >
                                    <IconSVG data="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                                        height={"48px"} width={"48px"} />
                                </Button>
                                <div className={styles.logoContainer}>
                                    <Image className={styles.logoPicture } layout="fill" objectFit="cover" 
                                        src={mainLogo} alt="Главное лого"  />
                                </div>
                                <div className={styles.linksContainer} >
                                    <span>
                                        <IconSVG data="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
                                        <CustomLink destination="/reservation-admin" text="Главная"  />
                                    </span>
                                    <span>
                                        <IconSVG data={"M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"} />
                                        <CustomLink destination="/reservation-admin/csv/session"
                                            text="Загрузка сеансов"  />
                                    </span>
                                    <span>
                                        <IconSVG data={"M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"} />
                                        <CustomLink destination="/reservation-admin/csv/play"
                                            text="Загрузка спектаклей"  />
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

export default AdminNavBar