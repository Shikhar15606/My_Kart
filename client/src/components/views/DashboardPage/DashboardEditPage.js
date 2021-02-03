import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from "react-redux";
import { Button, Input } from 'reactstrap';
import download from './download.png';
import './style.css';

function DashboardEditPage(props) {
    const user = useSelector(state => state.user)
    const [NameValue, setNameValue] = useState(user.userData ? user.userData.name : null)
    const [LastnameValue, setLastnameValue] = useState(null)
    const [ImageValue, setImageValue] = useState(null)
    const [IsLoading, setIsLoading] = useState(false)
    const [UpLoading, setUpLoading] = useState(false)
    const handleSubmit = (event) => {
        {
            setIsLoading(true);
            event.preventDefault();
            const datatosubmit = {
                email: user.userData.email,
                image: !ImageValue ? user.userData.image : ImageValue,
                name: !NameValue ? user.userData.name : NameValue,
                lastname: !LastnameValue ? user.userData.lastname : LastnameValue
            }

            Axios.post(`https://mykart1.herokuapp.com/api/users/dashboard/update`, datatosubmit)
                .then(response => {
                    setIsLoading(false);
                    console.log(response)
                    if (response.data.success) {
                        alert('User Information Updated')
                        props.history.push('/user/dashboard')
                    } else {
                        alert('Failed to Update Information')
                    }
                })
        }
    }

    const onDrop = (files) => {
        setUpLoading(true);
        let formData = new FormData();
        formData.append("upload_preset", "my-kart")
        formData.append("file", files[0])
        formData.append("cloud_name", "https-mykart1-herokuapp-com")
        fetch("https://api.cloudinary.com/v1_1/https-mykart1-herokuapp-com/image/upload", {
            method: "post",
            body: formData
        })
            .then(res => res.json())
            .then((response) => {
                setUpLoading(false);
                if (response.format === "jpg" || response.format === "png") {
                    if (response.secure_url) {
                        setImageValue(response.secure_url)
                    }
                    else {
                        alert('Failed to save the Image')
                    }
                } else {
                    alert('Only jpg and png files are allowed')
                }
            })
    }
    if (!IsLoading) {
        if (user.userData && user.userData.isAuth) {
            return (
                <div className="container">
                    <div style={{ textAlign: "center", marginTop: "40px" }}><h2>Edit your Details</h2></div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Dropzone
                            onDrop={onDrop}
                            multiple={false}
                            maxSize={800000000}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div
                                    style={{
                                        border: 'none', margin: "auto",
                                        display: 'inline', alignItems: 'center', justifyContent: 'center'
                                    }}
                                    {...getRootProps()}
                                >
                                    {console.log('getRootProps', { ...getRootProps() })}
                                    {console.log('getInputProps', { ...getInputProps() })}
                                    <input {...getInputProps()} />
                                    <div className="Icon col-12" >
                                        {(!UpLoading) ?
                                            <React.Fragment>
                                                <img src={ImageValue === null ? user.userData.image : `${ImageValue}`} alt={NameValue} style={{ maxHeight: "350px", maxWidth: "420px", minHeight: "220px", minWidth: "300px", display: "inline-block", margin: "auto" }} />
                                                <img src={download} alt="Edit" className="edit"></img>
                                            </React.Fragment>
                                            :
                                            <div style={{ textAlign: "center", marginTop: "5vh" }}>
                                                <span className="fa fa-spinner fa-pulse fa-5x fa-fw text-primary"></span>
                                                <h3 style={{ marginTop: "5vh" }}>Uploading Image ...</h3>
                                            </div>
                                        }
                                    </div>
                                </div>
                            )}
                        </Dropzone>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col col-sm-2 offset-sm-3 ">
                            <h6>First Name</h6>
                        </div>
                        <div className="col col-sm-4 ">
                            <Input type="text" name="name" id="name" value={NameValue === null ? user.userData.name : NameValue} onChange={(event) => { setNameValue(event.currentTarget.value) }} />
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col col-sm-2 offset-sm-3 ">
                            <h6>Last Name</h6>
                        </div>
                        <div className="col col-sm-4 ">
                            <Input type="text" name="lastname" id="lastname" value={LastnameValue === null ? user.userData.lastname : LastnameValue} onChange={(event) => { setLastnameValue(event.currentTarget.value) }} />
                        </div>
                    </div>
                    <br />
                    <div className="col col-sm-6 offset-sm-3">
                        <Button outline color="primary" size="lg" block style={{ textDecoration: "none" }} onClick={handleSubmit} >Update Now</Button>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div style={{ textAlign: "center", marginTop: "30vh" }}>
                    <span className="fa fa-spinner fa-pulse fa-5x fa-fw text-primary"></span>
                </div>
            )
        }
    }
    else {
        return (
            <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                <span className="fa fa-spinner fa-pulse fa-5x fa-fw text-primary"></span>
            </div>
        )
    }
}
export default DashboardEditPage;