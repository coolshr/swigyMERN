// import logo from './logo.svg';
import './App.css';
import React, { useLayoutEffect, useState } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter,
  Outlet
} from 'react-router-dom';

import Register from '../routes/auth/register';
import Home from '../routes/common/Home';
import SideMenu from '../components/sideMenu';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core';
import Header from '../components/header';
import { CssBaseline } from '@mui/material';
import Pageheader from '../components/pageHeader';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import SignUp from '../pages/employees';
import { createTheme } from "@material-ui/core/styles"
import Login from '../pages/Login';
import VendorDashboard from '../pages/vendorDashboard';
import BuyerDashboard from '../pages/buyerDashboard';
import Dashboard from '../pages/Dashboard';
import Food from '../pages/Menu';
import FoodMenu from '../pages/Menu';
import VendorMenu from '../pages/vendorMenu';
import AddFood from '../pages/AddFood';
function Layout(tag) {
  return (
    <>
      <SideMenu />
      {/* <h1>Layout</h1> */}
      {/* <Outlet /> */}
    </>
  );
}


const useStyles = makeStyles({
  appMain: {
    paddingLeft: "320px",
    width: "100%"
  }
})

const theme = createTheme({
  shape: {
    borderRadius: "12px"
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: "translateY(0px)"
      }
    }
  }
})

function App() {

  const classes = useStyles();

  return (
    <>
      <ThemeProvider theme={theme}>
        <SideMenu />
        <div className={classes.appMain}>
          <Header />
          <BrowserRouter>
            <Routes>
              <Route path="/" exact element={<SignUp />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/buyerDashboard" exact element={<BuyerDashboard />} />
              <Route path="/vendorDashboard" exact element={<VendorDashboard />} />
              <Route path="/Dashboard" exact element={<Dashboard />} />
              <Route path="/Menu" exact element={<FoodMenu />} />
              <Route path="/vendorMenu" exact element={<VendorMenu />} />
              <Route path="/addFood" exact element={<AddFood />} />
              {/* <Route path="/Rand" exact element={<Rand />} /> */}
            </Routes>
          </BrowserRouter>
          {/* <Employees/> */}
        </div>
        <CssBaseline />
      </ThemeProvider>
    </>
  );
}

export default App;
