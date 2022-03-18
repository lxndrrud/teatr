import React from 'react';
import Link from 'next/link';
import styles from './CustomLink.module.css'

export const CustomLink = ({destination, text}) => {
    return (
        <Link href={destination} ><a className={styles.customLink}>{text}</a></Link>
    );
};
