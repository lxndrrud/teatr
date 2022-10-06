import React from 'react'

function ErrorMessage ({ text }) {
    return (
        <div className="p-[5px] bg-[#fac5c8] w-[100%] rounded-md
                        flex flex-row justify-self-start">
            {
                typeof text === 'string'
                ? 
                    <span className="text-[#e63946]">{text}</span>
                : 
                    text && text.map(item => (
                        <p className="text-[#e63946]">{item}</p>
                    ))
            }
        </div>
    )
}

export default ErrorMessage