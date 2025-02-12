import React, { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery';
import './ProductImage.css'

function ProductImage(props) {
    const [Images, setImages] = useState([])

    useEffect(() => {
        if (props.detail.images && props.detail.images.length > 0) {
            let images = [];

            props.detail.images && props.detail.images.map(item => {
                images.push({
                    original: `${item}`,
                    thumbnail: `${item}`
                })
            })
            setImages(images)
        }
    }, [props.detail])

    return (
        <div>
            <ImageGallery items={Images} sizes="80%" />
        </div>
    )
}

export default ProductImage
