import React from 'react';
import { Link } from 'react-router-dom';

function ButtonLink ({ destination, text, linkType}) {
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
                // on default return blue
                return baseStyle + ' bg-[#1e3c66] hover:bg-[#072538] text-[#f1faee]'
        }
    } 
    
    return (
        <Link to={destination} className={fetchStyle(linkType)}>{text}</Link>
    );
};

export default ButtonLink
