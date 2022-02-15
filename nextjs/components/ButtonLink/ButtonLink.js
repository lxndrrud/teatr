import React from 'react';
import Link from 'next/link';
import styles from './ButtonLink.module.css'

export const ButtonLink = ({destination, text}) => {
    return (
        <Link href={destination} ><a className={styles.buttonLink}>{text}</a></Link>
    );
};
