/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu, Icon, Badge } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter ,Link} from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  if (user.userData && user.userData.isAuth && !user.userData.isAdmin) {
    return (
        <Menu mode={props.mode}>
  
          <Menu.Item key="dashboard">
            <Link to="/user/dashboard" style={{textDecoration:"none" }}>Hello {user.userData.name}</Link>
          </Menu.Item>
  
          <Menu.Item key="history">
            <Link to="/history" style={{textDecoration:"none" }}>History</Link>
          </Menu.Item>
  
          <Menu.Item key="cart" style={{ paddingBottom: 3 }}>
            <Badge count={user.userData && user.userData.cart.length}>
              <Link to="/user/cart" style={{ marginRight: -22 , color:'#667777'}}>
                <Icon type="shopping-cart" style={{ fontSize: 30, marginBottom: 3 }} />
              </Link>
            </Badge>
          </Menu.Item>
  
  
          <Menu.Item key="logout">
            <a onClick={logoutHandler} style={{textDecoration:"none" }}>Logout</a>
          </Menu.Item>
        </Menu>
      )
    } 
  else if(user.userData && user.userData.isAuth  && user.userData.isAdmin) {
    return (
      <Menu mode={props.mode}>

        <Menu.Item key="dashboard">
          <Link to="/user/dashboard" style={{textDecoration:"none" }}>Hello {user.userData.name}</Link>
        </Menu.Item>
        
        <Menu.Item key="history">
          <Link to="/history" style={{textDecoration:"none" }}>History</Link>
        </Menu.Item>

        <Menu.Item key="upload">
          <Link to="/product/upload" style={{textDecoration:"none" }}>Upload</Link>
        </Menu.Item>

        <Menu.Item key="cart" style={{ paddingBottom: 3 }}>
          <Badge count={user.userData && user.userData.cart.length}>
            <Link to="/user/cart" style={{ marginRight: -22 , color:'#667777'}}>
              <Icon type="shopping-cart" style={{ fontSize: 30, marginBottom: 3 }} />
            </Link>
          </Badge>
        </Menu.Item>


        <Menu.Item key="logout">
          <a onClick={logoutHandler} style={{textDecoration:"none" }}>Logout</a>
        </Menu.Item>
      </Menu>
    )
  }
  else if(user.userData && !user.userData.isAuth ) {
    return(
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <Link to="/login" style={{textDecoration:"none" }}>Signin</Link>
        </Menu.Item>
        <Menu.Item key="app">
          <Link to="/register" style={{textDecoration:"none" }}>Signup</Link>
        </Menu.Item>
      </Menu>
    )
  }
  else{
    return(
      <div>
      </div>
    )
  }
}
export default withRouter(RightMenu);