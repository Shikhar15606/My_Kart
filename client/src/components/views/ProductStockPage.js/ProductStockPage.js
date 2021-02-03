import React, { useState } from 'react';
import { Form, Input, FormGroup, Col, Button, Label, FormFeedback } from 'reactstrap';
import pic from './pre.gif';
import axios from 'axios';
import { withRouter } from 'react-router';
import { useSelector } from "react-redux";
import ErrorPage from '../ErrorPage/ErrorPage';

const ProductStockPage = (props) => {
    const user = useSelector(state => state.user)
    const [Stock, setStock] = useState(props.match.params.stock)
    const [Price, setPrice] = useState(props.match.params.price)
    const [negStock, setnegStock] = useState('')
    const [negPrice, setnegPrice] = useState('')

    const productId = props.match.params.productId
    const StockChange = (event) => {
        setStock(event.target.value)
        if (event.target.value < 0) {
            setnegStock('Number of items can not be negative')
        }
        else {
            setnegStock('')
        }
    }
    const PriceChange = (event) => {
        setPrice(event.target.value)
        if (event.target.value < 0) {
            setnegPrice('Price can not be negative')
        }
        else {
            setnegPrice('')
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (Stock >= 0 && Price >= 0) {
            const variables = {
                newstock: Stock,
                newprice: Price
            }
            axios.post(`https://mykart1.herokuapp.com/api/product/stock/${productId}`, variables)
                .then(response => {
                    if (response.data.success) {
                        alert("Stock Updated Successfully");
                        props.history.push(`/product/${productId}`)
                    } else {
                        alert('Some Error Occured')
                    }
                });
        }
        else {
            alert("Invalid Input")
        }
    }
    if (user.userData && user.userData.isAdmin) {
        return (
            <div>
                <div className="container">
                    <div className="col-12 col-md-6 offset-md-3" style={{ textAlign: 'center', marginTop: "20px" }} >
                        <h2>Change Stock</h2>
                    </div>
                    <div className="col-12 col-md-6 offset-md-3">
                        <img src={pic} alt="404 Not Found" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                    </div>
                    <div className="col-12 col-md-6 offset-md-3" style={{ marginTop: "5vh" }}>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup row>
                                <Col md={3}>
                                    <Label id="stock" >
                                        Stock :
                            </Label>
                                </Col>
                                <Col md={9}>
                                    <Input type="number" id="stock" name="stock" placeholder="Stock"
                                        value={Stock}
                                        onChange={StockChange}
                                        valid={negStock === ''}
                                        invalid={negStock !== ''} />
                                    <FormFeedback>{negStock}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={3}>
                                    <Label id="price" >
                                        Price :
                            </Label>
                                </Col>
                                <Col md={9}>
                                    <Input type="number" id="price" name="price" placeholder="Price"
                                        value={Price}
                                        onChange={PriceChange}
                                        valid={negPrice === ''}
                                        invalid={negPrice !== ''} />
                                    <FormFeedback>{negPrice}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={{ size: 12, offset: 0 }}>
                                    <Button outline type="submit" color="primary" size="lg" onClick={handleSubmit} block>
                                        Update Now
                                        </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
    else if (user.userData && !user.userData.isAdmin) {
        return (
            <ErrorPage />
        )
    }
    else {
        return (
            <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                <span className="fa fa-spinner fa-pulse fa-5x fa-fw text-primary"></span>
            </div>
        )
    }
};

export default withRouter(ProductStockPage);