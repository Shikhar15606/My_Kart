import React, { useState } from 'react'
import { Editor } from "@tinymce/tinymce-react";
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import FileUpload from '../../utils/FileUpload'
import Axios from 'axios';
import { useSelector } from "react-redux";
import pic from './pre.gif';
import ErrorPage from '../ErrorPage/ErrorPage';
import {TINY_API_KEY} from '../../../key';

const { Title } = Typography;

const Types = [
    { key: 1, value: "Mobiles" },
    { key: 2, value: "Laptops" },
    { key: 3, value: "Furniture" },
    { key: 4, value: "Home Entertainment" },
    { key: 5, value: "Audio Devices" },
    { key: 6, value: "Home Essentials" }
]

function UploadProductPage(props) {
    const user = useSelector(state => state.user)

    const [TitleValue, setTitleValue] = useState("")
    const [DescriptionValue, setDescriptionValue] = useState("")
    const [PriceValue, setPriceValue] = useState(0)
    const [StockValue, setStockValue] = useState(0)
    const [TypeValue, setTypeValue] = useState(1)
    const [Images, setImages] = useState([])
    const [Priceerr,setPriceerr] = useState('')
    const [Stockerr,setStockerr] = useState('')
    const [Loading,setLoading] = useState(false)

    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
    }

    const onDescriptionChange = (content, editor) => {
        setDescriptionValue(content)
    }

    const onPriceChange = (event) => {
        setPriceValue(event.currentTarget.value)
        if(event.target.value<0)
            setPriceerr('Price can\'t be negative')
        else
            setPriceerr('')
    }

    const onStockChange = (event) => {
        setStockValue(event.currentTarget.value)
        if(event.target.value<0)
            setStockerr('Stock can\'t be negative')
        else
            setStockerr('')
    }

    const onTypesSelectChange = (event) => {
        setTypeValue(event.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }
    const onSubmit = (event) => {
        setLoading(true)
        event.preventDefault();
        if (!TitleValue || !DescriptionValue || !PriceValue ||
            !TypeValue || !Images || !StockValue) {
            return alert('fill all the fields first!')
        }
        if(Stockerr !=='' || Priceerr!== '')
        {
            return alert("Invalid Input")
        }
        const variables = {
            writer: props.user.userData._id,
            title: TitleValue,
            description: DescriptionValue,
            price: PriceValue,
            images: Images,
            types: TypeValue,
            stock: StockValue,
        }

        Axios.post('/api/product/uploadProduct', variables)
            .then(response => {
                setLoading(false)
                if (response.data.success) {
                    alert('Product Successfully Uploaded')
                    props.history.push('/')
                } else {
                    alert('Failed to upload Product')
                }
            })
    }
    if(!Loading)    
    {
        if(user.userData && user.userData.isAdmin)
        {
            return (
                <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <Title level={2}> Upload Product</Title>
                    </div>


                    <Form onSubmit={onSubmit} >

                        {/* DropZone */}
                        <FileUpload refreshFunction={updateImages} />

                        <br />
                        <br />
                        <label>Title</label>
                        <Input
                            onChange={onTitleChange}
                            value={TitleValue}
                        />
                        <br />
                        <br />
                        <label>Description</label>
                        <Editor
                            apiKey={TINY_API_KEY}
                            init={{
                                height: 500,
                                menubar: false,
                                plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar:
                                'undo redo | formatselect | bold italic backcolor | \alignleft aligncenter alignright alignjustify | \bullist numlist outdent indent | removeformat | help'
                            }}
                            value={DescriptionValue}
                            onEditorChange={onDescriptionChange}
                        />
                        <br />
                        <br />
                        <label>Price($)</label>
                        <Input
                            onChange={onPriceChange}
                            value={PriceValue}
                            type="number"
                        />
                        { Priceerr && <div className="input-feedback" style={{marginTop:"5px"}}>{Priceerr}</div>}
                        <br /><br />
                        <label>Stock</label>
                        <Input
                            onChange={onStockChange}
                            value={StockValue}
                            type="number"
                        />
                        {Stockerr!=='' && <div className="input-feedback" style={{marginTop:5}}>{Stockerr}</div>}
                        <br /><br />
                        <select onChange={onTypesSelectChange} value={TypeValue}>
                            {Types.map(item => (
                                <option key={item.key} value={item.key}>{item.value} </option>
                            ))}
                        </select>
                        <br />
                        <br />

                        <Button
                            onClick={onSubmit}
                        >
                            Submit
                        </Button>

                    </Form>

                </div>
            )
        }
        else if(user.userData && !user.userData.isAdmin )
        {
            return(
                <ErrorPage />
            )
        }
        else
        {
            return(
            <div style={{textAlign:"center",marginTop:"30vh"}}>
                <span className="fa fa-spinner fa-pulse fa-5x fa-fw text-primary"></span>
                <h3 style={{marginTop:"5vh"}}>Loading ...</h3>
            </div>
            )
        }
    }
    else{
        return(
            <div style={{textAlign:"center",marginTop:"30vh"}}>
              <span className="fa fa-spinner fa-pulse fa-5x fa-fw text-primary"></span>
              <h3 style={{marginTop:"5vh"}}>Uploading Product ...</h3>
            </div>
        )
    }
}

export default UploadProductPage
