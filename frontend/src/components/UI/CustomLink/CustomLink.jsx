import React from 'react';
import {Link} from 'react-router-dom';
import styles from './CustomLink.module.css'

export default function CustomLink ({destination, text, style}) {
    let styleString = `${styles.customLink}`
    if (style) styleString += " " + style 
    return (
        <Link to={destination} className={styleString} >{text}</Link>
    );
};
