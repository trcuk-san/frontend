import { Navigate } from "react-router-dom";

//Dashboard
import DashboardEcommerce from "../pages/DashboardEcommerce";
// //Invoices
import Order from "../pages/Invoices/Order/OrderList";
import Car from "../pages/Invoices/Car/CarList";
import Member from "../pages/Invoices/MemberList";
import Invoices from "../pages/Invoices/Invoice/InvoicesList";
import OrderCreate from "../pages/Invoices/Order/OrderCreate";
import InvoiceDetails from "../pages/Invoices/Invoice/InvoiceDetails";
import OrderDetail from '../pages/Invoices/Order/OrderDetail';
// import List from "../pages/Invoices/List";
// import Details from "../pages/Invoices/Details";

// // Advance Ui
import UiScrollbar from "../pages/AdvanceUi/UiScrollbar/UiScrollbar";
import UiAnimation from "../pages/AdvanceUi/UiAnimation/UiAnimation";
import UiSwiperSlider from "../pages/AdvanceUi/UiSwiperSlider/UiSwiperSlider";
import UiRatings from "../pages/AdvanceUi/UiRatings/UiRatings";
import UiHighlight from "../pages/AdvanceUi/UiHighlight/UiHighlight";

// // Widgets
import Widgets from "../pages/Widgets/Index";



// //AuthenticationInner pages
import BasicSignIn from "../pages/AuthenticationInner/Login/BasicSignIn";
import CoverSignIn from "../pages/AuthenticationInner/Login/CoverSignIn";
import BasicSignUp from "../pages/AuthenticationInner/Register/BasicSignUp";
import CoverSignUp from "../pages/AuthenticationInner/Register/CoverSignUp";
import BasicPasswReset from "../pages/AuthenticationInner/PasswordReset/BasicPasswReset";

import CoverPasswReset from "../pages/AuthenticationInner/PasswordReset/CoverPasswReset";
import BasicLockScreen from "../pages/AuthenticationInner/LockScreen/BasicLockScr";
import CoverLockScreen from "../pages/AuthenticationInner/LockScreen/CoverLockScr";
import BasicLogout from "pages/AuthenticationInner/Logout/BasicLogout";
import CoverLogout from "../pages/AuthenticationInner/Logout/CoverLogout";
import BasicSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg";
import CoverSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/CoverSuccessMsg";
import BasicTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify";
import CoverTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/CoverTwosVerify";
import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
import Error500 from "../pages/AuthenticationInner/Errors/Error500";

import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import CoverPasswCreate from "../pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

// //APi Key
import APIKey from "../pages/APIKey/index";

// //login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// // User Profile
import UserProfile from "../pages/Authentication/user-profile";


// // Project
import CarCreate from "pages/Invoices/Car/CarCreate";
import InvoiceCreate from "../pages/Invoices/Invoice/InvoiceCreate";
import ReceiptList from "pages/Invoices/Receipt/ReceiptList";
import MemberProfile from "pages/Authentication/ProfileView";
import VehicleDetail from "pages/Invoices/Car/CarDetails";
import ReceiptCreate from "pages/Invoices/Receipt/ReceiptCreate";
import ReceiptDetail from "pages/Invoices/Receipt/ReceipDetail";
import VoucherList from "pages/Invoices/Voucher/VoucherList";
import VoucherCreate from "pages/Invoices/Voucher/VoucherCreate";
import MoreDetail from "pages/Invoices/Voucher/VoucherDetail";


const authProtectedRoutes = [

  // //Api Key
  { path: "/apps-api-key", component: <APIKey /> },
  // //Dashboard
  { path: "/dashboard", component: <DashboardEcommerce /> },

  // //Invoices
  { path: "/order", component: <Order /> },
  { path: "/order-create", component: <OrderCreate /> },
  { path: "/order/:id", component: <OrderDetail /> },
  { path: "/car", component: <Car /> },
  { path: "/car-create", component: <CarCreate /> },
  { path: "/car/:id", component: <VehicleDetail /> },
  { path: "/member", component: <Member /> },
  { path: "/profile/:userId", component: <MemberProfile /> },
  { path: "/invoices", component: <Invoices /> },
  { path: "/invoice-create", component: <InvoiceCreate /> },
  { path: "/invoices/:id", component: <InvoiceDetails /> },
  { path: "/receipt", component: <ReceiptList /> },
  { path: "/receipt-create", component: <ReceiptCreate /> },
  { path: "/receipt/:id", component: <ReceiptDetail /> },
  { path: "/voucher", component: <VoucherList /> },
  { path: "/voucher-create", component: <VoucherCreate /> },
  { path: "/voucher/:year/:month", component: <MoreDetail /> },

  // // Advance Ui
  { path: "/advance-ui-scrollbar", component: <UiScrollbar /> },
  { path: "/advance-ui-animation", component: <UiAnimation /> },
  { path: "/advance-ui-swiper", component: <UiSwiperSlider /> },
  { path: "/advance-ui-ratings", component: <UiRatings /> },
  { path: "/advance-ui-highlight", component: <UiHighlight /> },

  // // Widgets
  { path: "/widgets", component: <Widgets /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },


];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

  // //AuthenticationInner pages
  { path: "/auth-signin-basic", component: <BasicSignIn /> },
  { path: "/auth-signin-cover", component: <CoverSignIn /> },
  { path: "/auth-signup-basic", component: <BasicSignUp /> },
  { path: "/auth-signup-cover", component: <CoverSignUp /> },
  { path: "/auth-pass-reset-basic", component: <BasicPasswReset /> },
  { path: "/auth-pass-reset-cover", component: <CoverPasswReset /> },
  { path: "/auth-lockscreen-basic", component: <BasicLockScreen /> },
  { path: "/auth-lockscreen-cover", component: <CoverLockScreen /> },
  { path: "/auth-logout-basic", component: <BasicLogout /> },
  { path: "/auth-logout-cover", component: <CoverLogout /> },
  { path: "/auth-success-msg-basic", component: <BasicSuccessMsg /> },
  { path: "/auth-success-msg-cover", component: <CoverSuccessMsg /> },
  { path: "/auth-twostep-basic", component: <BasicTwosVerify /> },
  { path: "/auth-twostep-cover", component: <CoverTwosVerify /> },
  { path: "/auth-404-basic", component: <Basic404 /> },
  { path: "/auth-404-cover", component: <Cover404 /> },
  { path: "/auth-404-alt", component: <Alt404 /> },
  { path: "/auth-500", component: <Error500 /> },

  { path: "/auth-pass-change-basic", component: <BasicPasswCreate /> },
  { path: "/auth-pass-change-cover", component: <CoverPasswCreate /> },
  { path: "/auth-offline", component: <Offlinepage /> },
  { path: "/", exact: true, component: <Navigate to="/order" /> },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

export { authProtectedRoutes, publicRoutes };
