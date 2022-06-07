import styles from './MainLayout.module.css'
import { useEffect } from 'react'
import NavBarController from '../../components/NavBar/NavBarController/NavBarController'
import { useDispatch, useSelector } from 'react-redux'
import { toggleNavbar } from "../../store/actions/designAction"

export default function MainLayout({ children, title }) {
    const dispatch = useDispatch()
    let isHidden = useSelector(state => state.design.navbarIsHidden)
    let mainContentStyle = isHidden 
        ? styles.mainContent 
        : `${styles.mainContent} ${styles.mainContentExpanded}`
    useEffect(() => {
        document.title = "Брони на Оборонной"
    })

    return (
        <div className={styles.layout}>
            <NavBarController />
            <main className={mainContentStyle} onClick={() => {
                if (!isHidden) {
                    dispatch(toggleNavbar())
                }
            }}>
                <h1 className={styles.title}>{title}</h1>
                { children }
            </main>
        </div>
    )
}