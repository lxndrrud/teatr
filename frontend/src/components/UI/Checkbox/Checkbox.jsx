import React from 'react'

const Checkbox = ({ styleClass, id, name, labelText, defaultChecked, ...props}) => {
    return (
        <div>
            <input type="checkbox" { ...props } 
                id={id} name={name}  defaultChecked={defaultChecked} />
            <label htmlFor={id}>{labelText}</label>
        </div>
    )
}

export default Checkbox