import styles from './MainLayout.module.css'
import { useEffect } from 'react'
import NavBarController from '../../components/NavBar/NavBarController/NavBarController'

export default function MainLayout({ children, title }) {
    useEffect(() => {
        document.title = "Брони на Оборонной"
    })

    return (
        <div className={styles.layout}>
            <NavBarController />
            <main className={styles.mainContent}>
                <h1 className={styles.title}>{title}</h1>
                { children }
            </main>
        </div>
    )
}