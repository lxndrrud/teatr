import React from 'react';
import { Link } from 'react-router-dom';

export default function CustomLink ({destination, text }) {
    return (
        <Link to={destination} className="p-0 m-0 text-[inherit] text-[purple] hover:underline" >{text}</Link>
    );
};
