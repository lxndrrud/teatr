import { useEffect } from 'react'
import NavBarController from '../../components/NavBar/NavBarController/NavBarController'
import { useDispatch, useSelector } from 'react-redux'
import { toggleNavbar } from "../../store/actions/designAction"
import { footerStyle, layoutStyle, mainContentExpandedStyle, mainContentStyle, titleStyle, contentStyle } from '../Layout.styles'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'

export default function MainLayout({ children, title }) {
    const dispatch = useDispatch()
    let { navbarIsHidden } = useSelector(state => state.design)
    let mainContent = navbarIsHidden 
        ? mainContentStyle
        : `${mainContentStyle} ${mainContentExpandedStyle}`

    useEffect(() => {
        document.title = "Брони на Оборонной"
    }, [])

    return (
        <div>
            {/*<Header title={title} />*/}
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