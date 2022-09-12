import { useEffect } from 'react'
import NavBarController from '../../components/NavBar/NavBarController/NavBarController'
import { useDispatch, useSelector } from 'react-redux'
import { toggleNavbar } from "../../store/actions/designAction"
import { footerStyle, layoutStyle, mainContentExpandedStyle, mainContentStyle, titleStyle, contentStyle } from '../Layout.styles'
import Footer from '../../components/Footer/Footer'

export default function MainLayout({ children, title }) {
    const dispatch = useDispatch()
    let isHidden = useSelector(state => state.design.navbarIsHidden)
    let mainContent = isHidden 
        ? mainContentStyle
        : `${mainContentStyle} ${mainContentExpandedStyle}`

    useEffect(() => {
        document.title = "Брони на Оборонной"
    }, [])

    return (
        <div>
            <div className={layoutStyle}>
                <NavBarController />
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