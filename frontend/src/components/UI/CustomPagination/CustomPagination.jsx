import React, { useState } from 'react'
import { Pagination } from 'react-bootstrap'

const CustomPagination = ({ itemsQuantity, itemsOnPage}) => {
    let [activePage, setActivePage] = useState(1)
    const lastPage = Math.ceil(itemsQuantity / itemsOnPage)
    let items = []
    for (let i=1; i<lastPage + 1; i++) {
        items.push(
            <Pagination.Item key={i} active={i === active} onClick={() => {

            }}>
                {number}
            </Pagination.Item>
        )
    }
    return (
        <Pagination>
            {items}
        </Pagination>
    )
}

export default CustomPagination