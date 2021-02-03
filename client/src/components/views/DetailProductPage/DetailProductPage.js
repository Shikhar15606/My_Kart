import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Row, Col } from 'antd';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import { addToCart } from '../../../_actions/user_actions';
import { useDispatch } from 'react-redux';
import ErrorPage from '../ErrorPage/ErrorPage';

function DetailProductPage(props) {
    const dispatch = useDispatch();
    const productId = props.match.params.productId
    const [Product, setProduct] = useState([])
    const [isLoading, setLoading] = useState(true)
    useEffect(() => {
        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then((response) => {
                    setProduct(response.data)
                    setLoading(false)
            })
    }, [])

    const addToCartHandler = (productId,stock) => {
        dispatch(addToCart(productId,stock))
    }
    if(isLoading)
    {
        return(
            <div style={{textAlign:"center",marginTop:"30vh"}}>
                <span className="fa fa-spinner fa-pulse fa-5x fa-fw text-primary"></span>
                <h3 style={{marginTop:"5vh"}}>Loading ...</h3>
        </div>
        )
    }
    else if(Product){
    return (
        <div className="postPage" style={{ width: '100%', padding: '3rem 4rem' }}>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>{Product.title}</h1>
            </div>

            <br />

            <Row gutter={[16, 16]} >
                <Col lg={12} xs={24}>
                    <ProductImage detail={Product} />
                </Col>
                <Col lg={12} xs={24}>
                    <ProductInfo
                        addToCart={addToCartHandler}
                        detail={Product} />
                </Col>
            </Row>
        </div>
    )
    }
    else{
        return(
        <ErrorPage/>
        )
    }
}

export default DetailProductPage;
