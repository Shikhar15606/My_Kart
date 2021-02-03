import React, { useEffect, useState } from 'react'
import { Button, Descriptions } from 'antd';
import { Badge } from 'reactstrap';
import { useSelector } from "react-redux";
import axios from 'axios';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

function ProductInfo(props) {
    const user = useSelector(state => state.user)
    const [Product, setProduct] = useState({})
    const [Quantity, setQuantity] = useState(0)

    useEffect(() => {
        setProduct(props.detail)
    }, [props.detail])

    const addToCarthandler = () => {
        props.addToCart(props.detail._id, Product.stock)
        user.userData.cart.forEach(item => {
            if (item.id === props.detail._id) {
                setQuantity(item.quantity)
            }
        });
    }

    const DeleteProduct = () => {
        axios.get(`https://mykart1.herokuapp.com/api/product/delete/${props.detail._id}`)
            .then(response => {
                if (response.data.success) {
                    alert("Product deleted Successfully");
                    props.history.push("/")
                } else {
                    alert('Some Error Occured')
                }
            });
    }

    const Buttons = () => {
        console.log(user)
        if (user.userData && user.userData.isAuth && user.userData.isAdmin) {
            return (
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly" }}>
                    <div>
                        <Button size="large" shape="round" type="danger" onClick={DeleteProduct} >
                            Delete Product
                </Button>
                    </div>{
                        Product.stock > 0 && Product.stock > Quantity ?
                            <div>
                                <Button size="large" shape="round" type="danger" onClick={addToCarthandler}>
                                    Add to Cart
                </Button></div> : <div></div>}
                    <div>
                        <Link to={`/product/stock/${props.detail._id}/${Product.stock}/${Product.price}`} >
                            <Button size="large" shape="round" type="danger" >
                                Change Price and Stock
                </Button>
                        </Link></div>
                </div>
            )
        }
        else if (user.userData && user.userData.isAuth) {
            return (
                <div>
                    {
                        Product.stock > 0 && Product.stock > Quantity ?
                            <div>
                                <Button size="large" shape="round" type="danger" onClick={addToCarthandler}>
                                    Add to Cart
                </Button></div> : <div></div>}</div>
            )
        }
        else {
            return (
                <div>
                    <h7>Login to purchase the item</h7>
                </div>
            )
        }
    }

    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12" dangerouslySetInnerHTML={{ __html: Product.description }}>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h3><Badge color="danger">Just at $ {Product.price}</Badge></h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h3><Badge color="success">{Product.sold} Pieces already Sold</Badge></h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 ">
                        <h3><Badge color="primary">{Product.stock <= 3 ? Product.stock === 0 ? 'Out of Stock' : Product.stock === 1 ? "Only One Piece Left" : `Last ${Product.stock} pieces left` : `In Stock`}</Badge></h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 ">
                        <h3><Badge color="warning">Viewed {Product.views} times</Badge></h3>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <br />
            <div style={{ width: '100%' }}>
                <Buttons ></Buttons>
            </div>
        </div>
    )
}

export default withRouter(ProductInfo);