import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"
import UploadProductPage from './views/UploadProductPage/UploadProductPage'
import DetailProductPage from './views/DetailProductPage/DetailProductPage';
import CartPage from './views/CartPage/CartPage';
import HistoryPage from './views/HistoryPage/HistoryPage';
import ActivatePage from './views/ActivatePage/ActivatePage';
import ForgotPasswordPage from './views/ForgotPasswordPage/ForgotPassword';
import ResetPasswordPage from './views/ForgotPasswordPage/ResetPasswordPage';
import DashboardPage from './views/DashboardPage/DashboardPage';
import DashboardEditPage from './views/DashboardPage/DashboardEditPage';
import ErrorPage from './views/ErrorPage/ErrorPage';
import ProductStockPage from './views/ProductStockPage.js/ProductStockPage';

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '75px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/forgotpassword" component={Auth(ForgotPasswordPage, false)} />
          <Route exact path="/product/upload" component={Auth(UploadProductPage, true)} />
          <Route exact path="/product/:productId" component={Auth(DetailProductPage, null)} />
          <Route exact path="/product/stock/:productId/:stock/:price" component={Auth(ProductStockPage, true)} />
          <Route exact path="/activate/:token" component={Auth(ActivatePage, false)} />
          <Route exact path="/resetpassword/:token" component={Auth(ResetPasswordPage, false)} />
          <Route exact path="/user/cart" component={Auth(CartPage, true)} />
          <Route exact path="/user/dashboard" component={Auth(DashboardPage, true)} />
          <Route exact path="/user/dashboard/edit" component={Auth(DashboardEditPage, true)} />
          <Route exact path="/history" component={Auth(HistoryPage, true)} />
          <Route exact path="*" component={Auth(ErrorPage, null)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
