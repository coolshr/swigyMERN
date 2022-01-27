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
import PersonIcon from '@mui/icons-material/Person';
import FoodMenu from './Menu'


const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3)
  }
}))


const intialFVaues = {
  name: '',
  email: "",
  number: "",
  age: '',
  batch: "",
  password: ""
}

const BatchList = () => ([
  { id: 'UG1', title: 'UG1' },
  { id: 'UG2', title: 'UG2' },
  { id: 'UG3', title: 'UG3' },
  { id: 'UG4', title: 'UG4' },
  { id: 'UG5', title: 'UG5' }
])



export default function Buyer() {
  let navigate = useNavigate()

  const [edit, setEdit] = React.useState(true)
  const { values, setValues, errors, setErrors, handleInputChange, resetFunciton } = UseForm(intialFVaues);
  const classes = useStyles();




  useEffect(() => {
    async function fetchData() {
      // console.log("in b")
      const token = localStorage.getItem('token');
      if (token) {
        const user = jwt.decode(token);
        if (!user) {
          localStorage.removeItem('token');
          navigate('/login')
        }
        else {
          if (user.type !== "buyer")
            navigate('/login')
          else {
            const buyer = await fetch(`http://localhost:5000/user/`, {
              method: 'GET',
              headers: {
                'x-access-token': token
              }
            })
            const json = await buyer.json()
            setValues(json)
          }
        }
      }
      else {
        navigate('/login')
      }
    } fetchData();
  }, [])

  const validate = () => {
    let temp = {}
    temp.name = values.name ? "" : "This field is required"
    temp.age = values.age ? "" : "This field is required"
    temp.email = (/.+@.+\.[A-Za-z]+$/).test(values.email) ? "" : "Invalid Email"
    temp.number = values.number.length == 10 ? "" : "Incoorect number"
    temp.password = values.password.length >= 8 ? "" : "Password must be atleast 8 characters long"
    // temp.batch = values.batch.length != 0 ? "" : "This field is required"
    // console.log(temp)
    setErrors({
      ...temp
    })
    return Object.values(temp).every(x => x === "")
  }

  async function updateBuyer() {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/user/update`, {
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
      updateBuyer()
    }

  }


  return (
    <>
      <Paper className={classes.pageContent}>
        <Pageheader
          title="Buyer Dashboard"
          icon={<PersonIcon fontSize="large" />}
        />
        <Form onSubmit={handleSubmit}>
          <Grid container >
            <Grid item xs={6}>
              <Controls.Input
                name="name"
                disabled={edit}
                label="Full Name"
                value={values.name}
                onChangeEvent={handleInputChange}
                error={errors.name} />
              <Controls.Input
                name="email" disabled={edit}
                label="Email"
                value={values.email}
                onChangeEvent={handleInputChange}
                error={errors.email}
              />
              <Controls.Input
                name="number" disabled={edit}
                label="Mobile Number"
                value={values.number}
                onChangeEvent={handleInputChange}
                error={errors.number} />

            </Grid>
            <Grid item xs={6}>
              <Controls.Select
                name="batch"
                disabled={edit}
                label="Batch"
                value={values.batch}
                onChange={handleInputChange}
                items={BatchList()}
                error={errors.batch}
              />

              <Controls.Input
                name="age" disabled={edit}
                label="Age"
                type="number"
                value={values.age}
                onChangeEvent={handleInputChange}
                error={errors.age} />
              <Controls.Input
                name="password" disabled={edit}
                label="Password"
                type="password"
                value={values.password}
                onChangeEvent={handleInputChange}
                error={errors.password} />
            </Grid>
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
        </Form>
      </Paper>

    </>
  )
}