import React from 'react'
import IconSVG from '../IconSVG/IconSVG'
import styles from './Preloader.module.css'

function Preloader() {
    return (
        <div className={`w-[100%] md:ml-[20px] lg:ml-[-35px] flex justify-center align-center ${styles.preloader}`}>
            <IconSVG 
              width='100px'
              height='100px'
              data={'M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z'} />
        </div>
    )
}

export default Preloader
