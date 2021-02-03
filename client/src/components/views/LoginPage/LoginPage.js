import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Icon, Input, Button, Checkbox, Typography } from 'antd';
import { useDispatch } from "react-redux";
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import { GOOGLE_CLIENT_ID, FACEBOOK_APP_ID } from '../../../key';

const { Title } = Typography;

function LoginPage(props) {
  const dispatch = useDispatch();
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

  const [formErrorMessage, setFormErrorMessage] = useState('')
  const [rememberMe, setRememberMe] = useState(rememberMeChecked)
  const [isLoading, setisLoading] = useState(false)

  const handleRememberMe = () => {
    setRememberMe(!rememberMe)
  };

  const initialEmail = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';

  const responseSuccessGoogle = (response) => {
    setisLoading(true)
    console.log(response)
    axios({
      method: "POST",
      url: 'https://mykart1.herokuapp.com/api/users/googlelogin',
      data: { tokenId: response.tokenId }
    }).then(response => {
      if (response.status === 200) {
        let dataToSubmit = {
          email: response.data.email,
          password: response.data.password
        };

        dispatch(loginUser(dataToSubmit))
          .then(response => {
            setisLoading(false)
            if (response.payload.loginSuccess) {
              window.localStorage.setItem('userId', response.payload.userId);
              if (rememberMe === true) {
                window.localStorage.setItem('rememberMe', response.id);
              } else {
                localStorage.removeItem('rememberMe');
              }
              props.history.push("/");
            } else {
              setFormErrorMessage('Check out your Account or Password again')
            }
          })
          .catch(err => {
            setisLoading(false)
            setFormErrorMessage('Check out your Account or Password again')
            setTimeout(() => {
              setFormErrorMessage("")
            }, 3000);
          });
      } else {
        setisLoading(false)
        alert('Log In Failed')
      }
    })
  }
  const responseErrorGoogle = (response) => {
    setisLoading(false)
  }

  const responseFacebook = (response) => {
    setisLoading(true)
    console.log("facebook response")
    console.log(response);
    axios({
      method: "POST",
      url: 'https://mykart1.herokuapp.com/api/users/facebooklogin',
      data: { accessToken: response.accessToken, userID: response.userID }
    })
      .then(response => {
        if (response.status === 200) {
          let dataToSubmit = {
            email: response.data.email,
            password: response.data.password
          };

          dispatch(loginUser(dataToSubmit))
            .then(response => {
              setisLoading(false)
              if (response.payload.loginSuccess) {
                window.localStorage.setItem('userId', response.payload.userId);
                if (rememberMe === true) {
                  window.localStorage.setItem('rememberMe', response.id);
                } else {
                  localStorage.removeItem('rememberMe');
                }
                props.history.push("/");
              } else {
                setFormErrorMessage('Check out your Account or Password again')
              }
            })
            .catch(err => {
              setisLoading(false)
              setFormErrorMessage('Check out your Account or Password again')
              setTimeout(() => {
                setFormErrorMessage("")
              }, 3000);
            });
        } else {
          setisLoading(false)
          alert('Log In Failed')
        }
      })
  }
  return (
    <Formik
      initialValues={{
        email: initialEmail,
        password: '',
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setisLoading(true)
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password
          };

          dispatch(loginUser(dataToSubmit))
            .then(response => {
              if (response.payload.loginSuccess) {
                window.localStorage.setItem('userId', response.payload.userId);
                if (rememberMe === true) {
                  window.localStorage.setItem('rememberMe', values.id);
                } else {
                  localStorage.removeItem('rememberMe');
                }
                props.history.push("/");
              } else {
                setFormErrorMessage('Check out your Account or Password again')
              }
            })
            .catch(err => {
              setFormErrorMessage('Check out your Account or Password again')
              setTimeout(() => {
                setFormErrorMessage("")
              }, 3000);
            });
          setSubmitting(false);
        }, 500);
        setisLoading(false)
      }}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;
        if (isLoading) {
          return (
            <div style={{ textAlign: "center", marginTop: "30vh" }}>
              <span className="fa fa-spinner fa-pulse fa-5x fa-fw text-primary"></span>
            </div>
          )
        }
        else {
          return (
            <div className="app">

              <Title level={2}>Log In</Title>
              <form onSubmit={handleSubmit} style={{ width: '350px' }}>

                <Form.Item required>
                  <Input
                    id="email"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Enter your email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.email && touched.email ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback">{errors.email}</div>
                  )}
                </Form.Item>

                <Form.Item required>
                  <Input
                    id="password"
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Enter your password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.password && touched.password ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.password && touched.password && (
                    <div className="input-feedback">{errors.password}</div>
                  )}
                </Form.Item>

                {formErrorMessage && (
                  <label ><p style={{ color: '#ff0000bf', fontSize: '0.7rem', border: '1px solid', padding: '1rem', borderRadius: '10px' }}>{formErrorMessage}</p></label>
                )}

                <Form.Item>
                  <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe} >Remember me</Checkbox>
                  <Link className="login-form-forgot" to="/forgotpassword" style={{ float: 'right' }}>
                    forgot password
            </Link>
                  <div>
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }} disabled={isSubmitting} onSubmit={handleSubmit}>
                      Log in
          </Button>
                  </div>
          Or <Link to="/register">register now!</Link>
                </Form.Item>
              </form>
              <GoogleLogin
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Login with Google"
                onSuccess={responseSuccessGoogle}
                onFailure={responseErrorGoogle}
                cookiePolicy={'single_host_origin'}
                render={renderProps => (
                  <button className="google-btn" onClick={renderProps.onClick} disabled={renderProps.disabled}><i class="fa fa-google-plus" id="google-icon" aria-hidden="true"></i><span id="google-text">Login with Google</span> </button>
                )}
              />
              <div >
                <FacebookLogin
                  appId={FACEBOOK_APP_ID}
                  autoLoad={false}
                  callback={responseFacebook}
                  render={renderProps => (
                    <button className="facebook-btn" onClick={renderProps.onClick}> <i class="fa fa-facebook" aria-hidden="true" id="facebook-icon"></i><span id="facebook-text">Login with Facebook</span> </button>
                  )}
                />
              </div>
            </div>
          );
        }
      }}
    </Formik>
  );
}

export default withRouter(LoginPage);


