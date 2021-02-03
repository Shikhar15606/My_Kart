import React from 'react';
import { useSelector } from "react-redux";
import { Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

function DashboardPage(props) {
    const user = useSelector(state => state.user)
    if (user.userData && user.userData.isAuth) {
        return (
            <div className="container">
                <div className="row" style={{ marginTop: "50px" }}>
                    <img src={user.userData.image} alt={user.userData.name} style={{ maxHeight: "250px", maxWidth: "320px", minHeight: "150px", minWidth: "220px", borderRadius: "50%", display: "block", margin: "auto" }} />
                </div>
                <br />
                <div style={{ textAlign: "center" }}><h2>{user.userData.name} {user.userData.lastname}</h2></div>
                <div style={{ textAlign: "center" }}><h2>Dashboard</h2></div>
                <Alert className="col col-sm-6 offset-sm-3" color="success" style={{ textAlign: "center" }}>
                    {user.userData.isAdmin ? "You are an Administrator of My Kart" : "Hey There Welcome to My Kart"}
                </Alert>
                <div className="row">
                    <div className="col col-sm-2 offset-sm-4">
                        <h6>First Name</h6>
                    </div>
                    <div className="col col-sm-2 offset-sm-1">
                        <h6>{user.userData.name}</h6>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col col-sm-2 offset-sm-4">
                        <h6>Last Name</h6>
                    </div>
                    <div className="col col-sm-2 offset-sm-1">
                        <h6>{user.userData.lastname}</h6>
                    </div>
                </div>
                <br />
                <Alert className="col col-sm-6 offset-sm-3" color="success" style={{ textAlign: "center" }}>
                    {user.userData.email}
                </Alert>
                <br />
                <div className="row">
                    <div className="col col-sm-6 offset-sm-3">
                        <Link to="/user/dashboard/edit" style={{ textDecoration: "none" }}><Button outline color="primary" size="lg" block >Update your Dashboard</Button></Link>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div style={{ textAlign: "center", marginTop: "30vh" }}>
                <span className="fa fa-spinner fa-pulse fa-5x fa-fw text-primary"></span>
                <h3 style={{ marginTop: "5vh" }}>Loading ...</h3>
            </div>
        )
    }
}
export default DashboardPage;