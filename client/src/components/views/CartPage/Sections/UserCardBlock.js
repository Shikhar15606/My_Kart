import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

function UserCardBlock(props) {



    const renderCartImage = (images) => {
        if (images.length > 0) {
            let image = images[0]
            return `${image}`
        }
    }

    const renderItems = () => (
        props.products && props.products.map(product => (
            <tr key={product._id}>
                <td style={{ textAlign: "center" }}>
                    <Link to={`/product/${product._id}`}><img style={{ minWidth: '100px', minHeight: '100px', maxWidth: '150px', maxHeight: '150px' }} alt="product"
                        src={renderCartImage(product.images)} /></Link>
                </td>
                <td style={{ textAlign: "center" }}>{product.quantity} EA</td>
                <td style={{ textAlign: "center" }}>$ {product.price} </td>
                <td style={{ textAlign: "center" }}>
                    <Button outline color="info" onClick={() => props.removeItem(product._id)} >Remove</Button>
                </td>
            </tr>
        ))
    )


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>Product Image</th>
                        <th style={{ textAlign: "center" }}>Product Quantity</th>
                        <th style={{ textAlign: "center" }}>Product Price</th>
                        <th style={{ textAlign: "center" }}>Remove from Cart</th>
                    </tr>
                </thead>
                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCardBlock
