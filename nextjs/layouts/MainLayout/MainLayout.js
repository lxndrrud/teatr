import { CustomLink } from '../../components/UI/CustomLink/CustomLink'
import CustomButton from '../../components/UI/CustomButton/CustomButton'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from "next/router"
import styles from './MainLayout.module.css'
import { logOut } from '../../store/actions/userAction'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import mainLogo from "../../storage/index-logo.png"

export default function MainLayout({ children, title }) {
    const dispatch = useDispatch()
    const router = useRouter()
    let [token, setToken] = useState(useSelector(state => state.user.token))
    const tokenCheck = () => {
        if (token && token.length > 0) return true
        return false
    }
    let [isLoggedIn, setIsLoggedIn] = useState(tokenCheck())
    useEffect(() => {
        if (tokenCheck())
            setIsLoggedIn(true)
        else
            setIsLoggedIn(false)
        
    }, [token])
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

    return (
    <div className={styles.layout}>
       
        { 
            !isLoggedIn
            ? (
                <nav className={styles.navLinks}>
                    <Image src={mainLogo} alt="Главное лого" height="100" width="100" />
                    <CustomLink destination="/" text="Главная" style={styles.navLink} />
                    <CustomLink destination="/repertoire" text="Репертуар" style={styles.navLink} />
                    <CustomLink destination="/schedule" text="Расписание" style={styles.navLink} />
                    <CustomLink destination="/register" text="Зарегистрироваться" style={styles.navLink} />
                    <CustomLink destination="/login" text="Войти" style={styles.navLink} />
                </nav>
            )
            : (
                <nav className={styles.navLinks}>
                    <Image src={mainLogo} alt="Главное лого" height="100" width="100" />
                    <CustomLink destination="/" text="Главная" style={styles.navLink} />
                    <CustomLink destination="/repertoire" text="Репертуар" style={styles.navLink} />
                    <CustomLink destination="/schedule" text="Расписание" style={styles.navLink} />
                    <CustomLink destination="/control" text="Управление бронями" style={styles.navLink} />
                    <CustomButton type="submit" value="Выйти" 
                        onClickHook={logOutOnClick}
                        styleClass={styles.logOutButton}/>
                </nav>
            )
        }
        <main className={styles.mainContent}>
            <h1 className={styles.title}>{title}</h1>
            { children }
        </main>
    </div>)
}