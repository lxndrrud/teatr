import React from 'react'

function InputDate({ children, onChange, description, styleClass, ...props }) {
    let customStyleClass = `mt-0 py-[7px] pr-[40px] pl-[12px] w-[210px] h-[45px] bg-[white] shadow-[0_1px_3px_-2px_#9098a9] 
                            border border-solid border-[#e8eaed] focus:border-[#0088ff] hover:border-[#0088ff]
                            rounded-lg cursor-pointer`
    if (styleClass) 
        customStyleClass = `${customStyleClass} ${styleClass}`
    return (
        <div className='flex flex-col'>
            { description && <span>{description}</span> }
            <input {...props} 
                lang="ru-RU"
                type="date"
                onChange={onChange} 
                className={customStyleClass} >
                { children }
            </input>
        </div>
        
    )
}

export default InputDate