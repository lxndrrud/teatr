import React, { useState } from 'react'


function TooltipButton({ tooltipText }) {
    let [isTextHidden, setIsTextHidden] = useState(true)
    let style = isTextHidden 
        ? `hidden` 
        : 'md:fixed ml-3 px-2 font-[18px] font-normal bg-[#f1faee] rounded-md '

    return (
        <span className="flex flex-row">
            <button className="px-1 py-0 border border-solid border-[#cc6699] rounded-full" 
                onClick={() => { setIsTextHidden(!isTextHidden) }}>
                    {isTextHidden ? '?' : '!'}
            </button>
            <span className={style}>
                {tooltipText}
            </span>
            
        </span>
           
    )
}

export default TooltipButton