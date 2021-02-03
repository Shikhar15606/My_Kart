import React from 'react';
import pic from './pre.gif';
import pi from './xyz.jpg';

const ErrorPage = () => {
    return (
        <div className="container" >
            <div className="row">
                <img src={pi} alt="404 Not Found" style={{maxHeight:"250px",maxWidth:"320px",minHeight:"150px",minWidth:"220px",display:"block" , margin:"auto"}} />
            </div>
            <div className="row">
                <div className="col col-sm-12 offset-sm-0 col-md-8 offset-md-2" >
                    <img src={pic} alt="404 Not Found" style={{maxWidth:"100%",maxHeight:"100%"}} />
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;