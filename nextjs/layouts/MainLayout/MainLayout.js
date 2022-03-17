import { CustomLink } from '../../components/CustomLink/CustomLink'
import CustomButton from '../../components/CustomButton/CustomButton'
import { useDispatch, useSelector } from 'react-redux'
import styles from './MainLayout.module.css'
import { logOut } from '../../store/actions/userAction'
import { useEffect, useState } from 'react'

export default function MainLayout({ children, title }) {
    const dispatch = useDispatch()
    let [token, setToken] = useState(useSelector(state => state.user.token))
    const tokenCheck = () => {
        if (token && token.length > 0) return true
        return false
    }
    let [isLoggedIn, setIsLoggedIn] = useState(tokenCheck() ? true: false)
    useEffect(() => {
        if (tokenCheck())
            setIsLoggedIn(true)
        else
            setIsLoggedIn(false)
        
    }, [token])
    const logOutOnClick = (e) => {
        e.preventDefault()
        dispatch(logOut())
        setToken('')
    }

    return (
    <div className={styles.layout}>
        { 
            !isLoggedIn
            ? (
                <nav className={styles.navLinks}>
                    <CustomLink destination="/" text="Главная" />
                    <CustomLink destination="/repertoire" text="Репертуар" />
                    <CustomLink destination="/schedule" text="Расписание" />
                    <CustomLink destination="/register" text="Зарегистрироваться" />
                    <CustomLink destination="/login" text="Войти" />
                </nav>
            )
            : (
                <nav className={styles.navLinks}>
                    <CustomLink destination="/" text="Главная" />
                    <CustomLink destination="/repertoire" text="Репертуар" />
                    <CustomLink destination="/schedule" text="Расписание" />
                    <CustomButton type="submit" value="Выйти" 
                        onClickHook={logOutOnClick}
                        styleClass={styles.logOutButton}/>
                </nav>
            )
        }
        <h1 className={styles.title}>{title}</h1>
        <main className={styles.mainContent}>
            { children }
        </main>
    </div>)
}