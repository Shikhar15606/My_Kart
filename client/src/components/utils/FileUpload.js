import React, { useState } from 'react'
import Dropzone from 'react-dropzone';
import { Icon } from 'antd';
import Axios from 'axios';
function FileUpload(props) {

    const [Images, setImages] = useState([])
    const [Loading, setLoading] = useState(false)

    const onDrop = (files) => {
        setLoading(true)
        let formData = new FormData();
        formData.append("upload_preset","my-kart")
        formData.append("file", files[0])
        formData.append("cloud_name","https-mykart1-herokuapp-com")
        fetch("https://api.cloudinary.com/v1_1/https-mykart1-herokuapp-com/image/upload",{
            method:"post",
            body:formData
        })
        .then(res => res.json())
        .then((response)=>{
                setLoading(false)
                if ( response.format === "jpg" || response.format === "png") {
                    if(response.secure_url){
                        setImages([...Images, response.secure_url])
                        props.refreshFunction([...Images, response.secure_url])
                    }
                    else
                    {
                        alert('Failed to save the Image')
                    }
                } else {
                    alert('Only jpg and png files are allowed')
                }
        })
    }
    const onDelete = (image) => {
        const currentIndex = Images.indexOf(image);

        let newImages = [...Images]
        newImages.splice(currentIndex, 1)

        setImages(newImages)
        props.refreshFunction(newImages)
    }
    if(!Loading)
    {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Dropzone
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={800000000}
                >
                    {({ getRootProps, getInputProps }) => (
                        <div style={{
                            width: '300px', height: '240px', border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                            {...getRootProps()}
                        >
                            {console.log('getRootProps', { ...getRootProps() })}
                            {console.log('getInputProps', { ...getInputProps() })}
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize: '3rem' }} />
                        </div>
                    )}
                </Dropzone>

                <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>
                    {Images.map((image, index) => (
                        <div onClick={() => onDelete(image)}>
                            <img style={{ minWidth: '300px', width: '300px', height: '240px' }} src={`${image}`} alt={`productImg-${index}`} />
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    else
    {
        return(
            <div style={{textAlign:"center",marginTop:"30vh"}}>
              <span className="fa fa-spinner fa-pulse fa-5x fa-fw text-primary"></span>
              <h3 style={{marginTop:"5vh"}}>Uploading Image ...</h3>
            </div>
        )
    }
}

export default FileUpload
