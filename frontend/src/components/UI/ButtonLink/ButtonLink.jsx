import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ButtonLink.module.css'

function ButtonLink ({ destination, text, linkType}) {
    const fetchStyle = (type) => {
        const red = styles.red,
            blue = styles.blue,
            green = styles.green,
            buttonLink = styles.buttonLink
        
        switch(type) {
            case "red":
                return `${buttonLink} ${red}`
            case "blue":
                return `${buttonLink} ${blue}`
            case "green":
                return `${buttonLink} ${green}`
            default:
                return `${buttonLink} ${blue}`
        }
    } 
    
    return (
        <Link href={destination} className={fetchStyle(linkType)}>{text}</Link>
    );
};

export default ButtonLink
