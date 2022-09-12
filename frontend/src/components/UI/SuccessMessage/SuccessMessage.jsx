import React from 'react'

function SuccessMessage({ text }) {
    return (
        <div className="p-1 w-[max-content] flex flex-row justify-self-start bg-[lightgreen] rounded-md">
            <span className="text-[green]">
                {text}
            </span>
        </div>
    )
}

export default SuccessMessage