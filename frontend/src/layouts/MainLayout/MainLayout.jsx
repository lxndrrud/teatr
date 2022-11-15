import { useEffect } from 'react'
import NavBarController from '../../components/NavBar/NavBarController/NavBarController'
import { useDispatch, useSelector } from 'react-redux'
import { toggleNavbar } from "../../store/actions/designAction"
import { footerStyle, layoutStyle, mainContentExpandedStyle, mainContentStyle, titleStyle, contentStyle } from '../Layout.styles'
import Footer from '../../components/Footer/Footer'
import Header, { HeaderController } from '../../components/Header/Header'
import curtain from  '../../assets/curtain.png'
//import '../Layout.css'

export default function MainLayout({ children, title }) {
    const dispatch = useDispatch()
    let { navbarIsHidden } = useSelector(state => state.design)
    let mainContent = navbarIsHidden 
        ? mainContentStyle
        : mainContentStyle
        //: `${mainContentStyle} ${mainContentExpandedStyle}`

    useEffect(() => {
        document.title = "Брони на Оборонной"
    }, [])

    return (
        <div>
            { /*<Header /> */}
            <HeaderController />
            <div className={layoutStyle}>
                {/* <NavBarController /> */}
                <div className='layout_left lg:w-[200px] bg-[blue]' >
                </div>
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
                </main>
                <div className='layout_right lg:w-[200px] bg-[blue]' >
                </div>
                <footer className={footerStyle}>
                    <Footer />
                </footer>
            </div>
            
        </div>
    )
}