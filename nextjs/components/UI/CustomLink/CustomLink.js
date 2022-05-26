import React from 'react';
import Link from 'next/link';
import styles from './CustomLink.module.css'

export const CustomLink = ({destination, text, style}) => {
    let styleString = `${styles.customLink}`
    if (style) styleString += " " + style 
    return (
        <Link href={destination} ><a className={styleString}>{text}</a></Link>
    );
};
