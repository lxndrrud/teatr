import { CustomLink } from '../../components/CustomLink/CustomLink'
import styles from './MainLayout.module.css'

export default function MainLayout({ children, title }) {
    return (
    <div className={styles.layout}>
        <nav className={styles.navLinks}>
            <CustomLink destination="/" text="Главная" />
            <CustomLink destination="/repertoire" text="Репертуар" />
            <CustomLink destination="/schedule" text="Расписание" />
        </nav>
        <h1>{title}</h1>
        <main className={styles.mainContent}>
            { children }
        </main>
    </div>)
}