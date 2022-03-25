import React from 'react';
import Link from 'next/link';
import styles from './ButtonLink.module.css'

export const ButtonLink = ({ destination, styleClass, text}) => {
    let customStyleClass = `${styles.buttonLink}`
    if (styleClass)
        customStyleClass = `${styleClass} ${customStyleClass} `
    return (
        <Link href={destination} ><a className={customStyleClass}>{text}</a></Link>
    );
};
