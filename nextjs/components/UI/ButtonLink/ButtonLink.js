import React from 'react';
import Link from 'next/link';
import styles from './ButtonLink.module.css'

export const ButtonLink = ({ destination, text, linkType}) => {
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
        <Link href={destination} ><a className={fetchStyle(linkType)}>{text}</a></Link>
    );
};
