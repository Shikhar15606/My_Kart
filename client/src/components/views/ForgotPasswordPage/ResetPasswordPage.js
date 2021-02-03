import React, { Component } from 'react';
import Axios from 'axios';
import { USER_SERVER } from '../../Config';
import {Form , Input , FormGroup , Col, FormFeedback ,Button} from 'reactstrap'
import pic from './pre.gif';
import 'font-awesome/css/font-awesome.min.css';

function Success(obj) {
    console.log("Object")
    console.log(obj);
    if(obj.obj.success)
    return (
            <div style={{ textAlign:'center',marginTop:"10vh"}} >
                <h3> Your Password has been changed </h3>
                <br/>
                <h5> Kindly go to the login page to login with your email and new password</h5>
            </div>
    );
    else if(obj.obj.error)
    return (
        <div style={{ textAlign:'center' ,marginTop:"10vh"}}>
            <h3>{obj.obj.error}</h3>
        </div>            
    );
    else
    return (
        <div style={{ textAlign:'center',marginTop:"10vh" }}>
            <h1> </h1>
        </div>
    );
}

class ResetPasswordPage extends Component {
    constructor(props)
    {
        super(props)
        this.state = {
            password:'',
            token: props.match.params.token,
            success:'',
            error:'',
            err:'',
            touched:{
                password:false,
            },
            Loading:false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({          
            [name]: value
        });
    }
    handleSubmit (event) {
        event.preventDefault();
        this.setState({
            Loading:true
        })
        const datatoSubmit = {
            token:this.state.token,
            password:this.state.password
        }
        Axios.post(`${USER_SERVER}/resetpassword`,datatoSubmit )
            .then(response => {
                this.setState({
                    Loading: false
                  });
                console.log(response)
                if (response.data.success) {
                    this.setState({
                        success: response.data.success
                      });
                } else if(response.data.error) {
                    this.setState({
                        error: response.data.error
                      });   
                }
                else {
                    this.setState({
                        err: response.data.err.errmsg
                      });
                }
            })
        
    }
    handleBlur =(field) =>(evt)=>{
        this.setState({
            touched:{...this.state.touched,[field]:true}
        })
    }
    validate(password){
        const errors ={
            password:'',
        }
        if(this.state.touched.password&&password.length<6)
        errors.password='Password must have atleast 6 characters'
        return errors;
    }
    render(props) {
        const obj = {success: this.state.success,error:this.state.error}
        const errors =this.validate(this.state.password)
        if(!this.state.Loading)
        {
            return (
                <div className="container">
                <div className="col-12 col-md-6 offset-md-3" style={{ textAlign:'center',marginTop:"20px"}} >
                    <h2>Change Password</h2>
                </div>
                <div className="col-12 col-md-6 offset-md-3">
                    <img src={pic} alt="404 Not Found" style={{maxWidth:"100%",maxHeight:"100%"}} />
                </div>
                <div className="col-12 col-md-6 offset-md-3" style={{marginTop:"5vh"}}>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup row>
                                    {/* <Label htmlFor="password" md={3}>New Password</Label> */}
                                    <Col md={12}>
                                        <Input type="password" id="password" name="password"
                                            placeholder="New Password"
                                            value={this.state.password}
                                            valid={errors.password === ''}
                                            invalid={errors.password !== ''}
                                            onBlur={this.handleBlur('password')}
                                            onChange={this.handleInputChange} />
                                        <FormFeedback>{errors.password}</FormFeedback>
                                    </Col>
                    </FormGroup>
                    <FormGroup row>
                                    <Col md={{size: 12, offset: 0}}>
                                        <Button outline type="submit" color="primary" size="lg" block>
                                            Change Password
                                        </Button>
                                    </Col>
                    </FormGroup>
                </Form>
                </div>
                <Success obj= {obj}></Success>
                </div>
            );
        }
        else
        {
            return(
                <div style={{textAlign:"center",marginTop:"30vh"}}>
                    <span className="fa fa-spinner fa-pulse fa-5x fa-fw text-primary"></span>
                </div>
            )
        }
    }
}

export default ResetPasswordPage;