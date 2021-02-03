import React, { Component } from 'react';
import Axios from 'axios';
import { USER_SERVER } from '../../Config';
import {Form , Input , FormGroup , Col, FormFeedback ,Button} from 'reactstrap';
import pic from './pre.gif';
import 'font-awesome/css/font-awesome.min.css';

function Success(obj) {
    if(obj.obj.success)
    return (
            <div style={{ textAlign:'center',marginTop:"10vh"}} >
                <h3> Reset Password link sent at your email  </h3>
                <br/>
                <h5> Kindly click on the link to change your password. Link is valid only for 20 minutes </h5>
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

class ForgotPasswordPage extends Component {
    constructor(props)
    {
        super(props)
        this.state = {
            email:'',
            success:'',
            error:'',
            err:'',
            touched:{
                email:false,
            },
            Loading:false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({          
            [name]: value
        });
    }
    handleSubmit (event) {
        event.preventDefault();
        const datatoSubmit = {
            email:this.state.email
        }
        this.setState({
            Loading:true
        })
        Axios.post(`${USER_SERVER}/forgotpassword`,datatoSubmit )
            .then(response => {
                this.setState({
                    Loading: false
                  });
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
    validate(email){
        const errors ={
            email:'',
        }
        if(this.state.touched.email&&email.split('').filter(x=>x==='@').length!==1)
        errors.email='Email should have an @ sign'
        return errors;
    }
    render(props) {
        const obj = {success: this.state.success,error:this.state.error}
        console.log(obj);
        const errors =this.validate(this.state.email)
        if(!this.state.Loading)
        {
            return (
                <div className="container">
                <div className="col-12 col-md-6 offset-md-3" style={{ textAlign:'center',marginTop:"20px"}} >
                    <h2>Forgot Password</h2>
                </div>
                <div className="col-12 col-md-6 offset-md-3">
                    <img src={pic} alt="404 Not Found" style={{maxWidth:"100%",maxHeight:"100%"}} />
                </div>
                <div className="col-12 col-md-6 offset-md-3" style={{marginTop:"5vh"}}>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup row>
                                    {/* <Label htmlFor="email" md={2}>Email</Label> */}
                                    <Col md={12}>
                                        <Input type="email" id="email" name="email"
                                            placeholder="Email"
                                            value={this.state.email}
                                            valid={errors.email === ''}
                                            invalid={errors.email !== ''}
                                            onBlur={this.handleBlur('email')}
                                            onChange={this.handleInputChange} />
                                        <FormFeedback>{errors.email}</FormFeedback>
                                    </Col>
                    </FormGroup>
                    <FormGroup row>
                                    <Col md={{size: 12, offset: 0}}>
                                        <Button outline type="submit" color="primary" size="lg" block>
                                            Send Link
                                        </Button>
                                    </Col>
                    </FormGroup>
                </Form>
                </div>
                <Success obj = {obj}></Success>
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

export default ForgotPasswordPage;
