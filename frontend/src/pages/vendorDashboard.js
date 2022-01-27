import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { IconButton, makeStyles, Paper } from '@material-ui/core';
import Pageheader from '../components/pageHeader'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import jwt from 'jsonwebtoken';
import { UseForm, Form } from "../components/useForm";
import { Controls } from "../components/controls/controls";
import { Grid } from "@material-ui/core";
import TimePicker from '@mui/lab/TimePicker';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import EditIcon from '@mui/icons-material/Edit';

const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3)
  }
}))


const intialFVaues = {
  managerName: '',
  email: "",
  contactNumber: "",
  shopName: '',
  openingTime: Date.now(),
  closingTime: Date.now(),
  password: ""
}




export default function Vendor() {
  let navigate = useNavigate()

  const [edit, setEdit] = React.useState(true)
  const { values, setValues, errors, setErrors, handleInputChange, resetFunciton } = UseForm(intialFVaues);
  const classes = useStyles();



  const handleTimeOpen = (e) => {
    setValues({
      ...values,
      openingTime: new Date(e)
    })
  }
  const handleTimeClose = (e) => {
    setValues({
      ...values,
      closingTime: new Date(e)
    })
  }
  useEffect(() => {
    async function fetchData() {
      console.log("useeffect")
      const token = localStorage.getItem('token');
      if (token) {
        const user = jwt.decode(token);
        if (!user) {

          localStorage.removeItem('token');
          navigate('/login')
        }
        else {
          if (user.type !== "vendor") {
            navigate('/login')
          }
          else {
            const vendor = await fetch(`http://localhost:5000/vendor/`, {
              method: 'GET',
              headers: {
                'x-access-token': token
              }
            })
            const json = await vendor.json()
            setValues(json)
          }
        }
      }
      else {
        alert("!user")
        navigate('/login')
      }
    } fetchData();
  }, [])

  const validate = () => {
    let temp = {}
    temp.managerName = values.managerName ? "" : "This field is required"
    temp.shopName = values.shopName ? "" : "This field is required"
    temp.email = (/.+@.+\.[A-Za-z]+$/).test(values.email) ? "" : "Invalid Email"
    temp.contactNumber = values.contactNumber.length == 10 ? "" : "Incoorect number"
    temp.password = values.password.length >= 8 ? "" : "Password must be atleast 8 characters long"
    // temp.batch = values.batch.length != 0 ? "" : "This field is required"
    // console.log(temp)
    setErrors({
      ...temp
    })
    return Object.values(temp).every(x => x === "")
  }

  async function updateVendor() {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/vendor/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify(values)
    });
    const data = await response.json();
    if (data.status == "error") {
      if (data.error == "EMAIL_ALREADY_EXISTS") {
        setErrors({
          ...errors,
          email: "Email already exists"
        })
      }
      if (data.error == "SHOP_NAME_ALREADY_EXISTS") {
        setErrors({
          ...errors,
          shopName: "Shop name already exists"
        })
      }
    }
    else
      setEdit(true)

  }

  const handleSubmit = e => {
    e.preventDefault()
    if (validate()) {
      updateVendor()
    }

  }


  return (
    <Paper className={classes.pageContent}>
      <Pageheader
        title="Vendor Dashboard"
        icon={<PersonAddAltIcon fontSize="large" />}
      />
      <Form onSubmit={handleSubmit}>
        <Grid container >
          <Grid item xs={6}>
            <Controls.Input
              disabled={edit}
              name="managerName"
              label="Manager Name"
              value={values.managerName}
              onChangeEvent={handleInputChange}
              error={errors.managerName} />
            <Controls.Input
              disabled={edit}
              name="email"
              label="Email"
              value={values.email}
              onChangeEvent={handleInputChange}
              error={errors.email} />
            <Controls.Input
              type="password"
              disabled={edit}
              name="password"
              label="Password"
              value={values.password}
              onChangeEvent={handleInputChange}
              error={errors.password} />
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="shopName"
              disabled={edit}
              label="Shop Name"
              value={values.shopName}
              onChangeEvent={handleInputChange}
              error={errors.shopName} />
            <Controls.Input
              name="contactNumber"
              disabled={edit}
              label="Mobile Number"
              value={values.contactNumber}
              onChangeEvent={handleInputChange}
              error={errors.mobile} />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                disabled={edit}
                label="Opening Time"
                name="openingTime"
                value={values.openingTime}
                onChange={handleTimeOpen}
                renderInput={(params) => <TextField {...params} />}
              />
              <TimePicker
                disabled={edit}
                label="Closing Time"
                name="closingTime"
                value={values.closingTime}
                onChange={handleTimeClose}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item container justifyContent='center' direction='row'>
            <br />
            <Controls.Button
              text="Submit"
              type="Submit"
            />
            <IconButton
              onClick={() => { setEdit(!edit) }}>
              <EditIcon />
            </IconButton>

          </Grid>
        </Grid>
      </Form>
    </Paper>
  )
}