import styles from '../Layout.module.css'
import { useEffect } from 'react'
import AdminNavBar from '../../components/NavBar/AdminNavBar/AdminNavBar'
import { useDispatch, useSelector } from 'react-redux'
import { toggleNavbar } from "../../store/actions/designAction"

export default function AdminLayout({ children, title }) {
    const dispatch = useDispatch()
    let isHidden = useSelector(state => state.design.navbarIsHidden)
    let mainContentStyle = isHidden 
        ? styles.mainContent 
        : `${styles.mainContent} ${styles.mainContentExpanded}`
    useEffect(() => {
        document.title = "Администрирование"
    })

    return (
        <div className={styles.layout}>
            <AdminNavBar />
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