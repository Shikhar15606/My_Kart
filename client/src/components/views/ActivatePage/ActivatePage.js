import React, { Component } from 'react';
import Axios from 'axios';
import { USER_SERVER } from '../../Config';

function Success(obj) {
    if(obj.success)
    return (
            <div style={{ textAlign:'center',marginTop:"30vh"}} >
                <h1>Your Email is Verified. </h1>
                <br/>
                <h2>Kindly go to the login page to login with your username and password</h2>
            </div>
    );
    else if(obj.error)
    return (
        <div style={{ textAlign:'center' ,marginTop:"30vh"}}>
            <h1>Your Authentication Link Expired. Try Again !!! </h1>
        </div>            
    );
    else
    return (
        <div style={{ textAlign:'center',marginTop:"30vh" }}>
            <h1>{obj.err}</h1>
        </div>
    );
}

class ActivatePage extends Component {
    constructor(props)
    {
        super(props)
        this.state = {
            datatoSubmit: { token : props.match.params.token},
            success:'',
            error:'',
            err:'',
        }
    }
    render(props) {
        Axios.post(`${USER_SERVER}/authentication/activate/`,this.state.datatoSubmit )
            .then(response => {
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
        return (
            <div>
                <Success success={this.state.success} error = {this.state.error} err = {this.state.err}/>
            </div>
        );
    }
}

export default ActivatePage;
