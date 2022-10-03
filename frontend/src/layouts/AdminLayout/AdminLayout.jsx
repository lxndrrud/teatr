import { footerStyle, layoutStyle, mainContentExpandedStyle, mainContentStyle, titleStyle, contentStyle } from '../Layout.styles'
import { useEffect } from 'react'
import AdminNavBar from '../../components/NavBar/AdminNavBar/AdminNavBar'
import { useDispatch, useSelector } from 'react-redux'
//import { toggleNavbar } from "../../store/actions/designAction"
import Footer from '../../components/Footer/Footer'

export default function AdminLayout({ children, title }) {
    const dispatch = useDispatch()
    let { navbarIsHidden: isHidden } = useSelector(state => state.design)
    let mainContent = isHidden 
        ? mainContentStyle
        : `${mainContentStyle} ${mainContentExpandedStyle}`
    useEffect(() => {
        document.title = "Администрирование"
    })

    return (
        <div>
            <div className={layoutStyle}>
                <AdminNavBar />
                <main className={mainContent} 
                    /*onClick={() => {
                        if (!isHidden) {
                            dispatch(toggleNavbar())
                        }
                        }}
                    */
                >
                    <h1 className={titleStyle}>{title}</h1>

                    <div className={contentStyle}>
                        { children }
                    </div>
                    
                    <footer className={footerStyle}>
                        <Footer />
                    </footer>
                </main>
            </div>
            
        </div>
    )
}