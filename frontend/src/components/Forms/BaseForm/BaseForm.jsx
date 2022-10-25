import React from 'react'

function BaseForm({ children, styleClass }) {
    let customStyleClass = `px-2 sm:px-0 w-[100%] sm:w-[50%] 
                            mx-0 sm:mx-auto
                            flex flex-col justify-start content-center`
    if (styleClass)
        customStyleClass = `${customStyleClass} ${styleClass}`
    return (
        <form className={customStyleClass}>
            
            { children }
        </form>
    )
}

export default BaseForm