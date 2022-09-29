import React from 'react'

function CustomButton({ onClickHook, buttonType, value, disabled }) {
    const fetchStyle = (type) => {
        const baseStyle = `p-2 flex flex-nowrap 
        border-solid rounded-md justify-center`
        switch(type) {
            case "red":
                return baseStyle + ' bg-[#c1121f] hover:bg-[#780000] text-[#f1faee]'
            case "purple":
                return baseStyle + ' bg-[#ae2876] hover:bg-[#072538] text-[#f1faee]'
            case "green":
                return baseStyle + ' bg-[#4a7110] hover:bg-[#223b1b] text-[#f1faee]'
            default:
                // on default return purple
                return baseStyle + ' bg-[#ae2876] hover:bg-[#072538] text-[#f1faee]'
        }
    } 
    //<input {... props } onClick={ onClickHook } className={ fetchStyle(buttonType) } />
    return (
        
        <button onClick={ onClickHook } className={ fetchStyle(buttonType) } disabled={disabled}>
            {value}
        </button>
    )
}

export default CustomButton