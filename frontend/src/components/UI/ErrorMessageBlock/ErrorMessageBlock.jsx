import React from 'react'

function ErrorMessageBlock ({ textArray }) {
    return (
        <div className="p-[5px] bg-[#fac5c8] w-[100%] rounded-md
                        flex flex-row justify-self-start">
            <ul>
                {
                    textArray && textArray.length > 0 && textArray.map(textItem => (
                        <li>
                            <span className="text-[#e63946]">{textItem}</span>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default ErrorMessageBlock