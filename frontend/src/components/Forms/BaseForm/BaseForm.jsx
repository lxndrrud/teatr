import React from 'react'

function BaseForm({ children, styleClass }) {
    let customStyleClass = `px-2 sm:px-0 w-[100%] sm:w-[35%] 
                            mx-0 sm:mx-auto
                            flex justify-center`
    if (styleClass)
        customStyleClass = `${customStyleClass} ${styleClass}`
    return (
        <form className={customStyleClass}>
            <div className="w-[100%] md:w-[75%] 
                            flex flex-col items-start">
                { children }
            </div>
        </form>
    )
}

export default BaseForm