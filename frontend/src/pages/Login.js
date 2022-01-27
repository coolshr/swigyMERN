import React from 'react'
import { Grid, Paper, makeStyles } from "@material-ui/core";
import { UseForm, Form } from "../components/useForm";
import { Controls } from "../components/controls/controls";
import Pageheader from '../components/pageHeader'
import LoginIcon from '@mui/icons-material/Login';


const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3)
  }
}))

export default function Login() {
  const classes = useStyles();


  const initialFValues = {
    email: "",
    password: ""
  }


  const {
    values,
    setValues,
    handleInputChange,
    errors,
    setErrors,
    resetFunciton
  } = UseForm(initialFValues);

  const validate = () => {
    let temp = {}
    temp.password = values.password ? "" : "This field is required"
    temp.email = (/.+@.+\.[A-Za-z]+$/).test(values.email) ? "" : "Invalid Email"
    setErrors({
      ...temp
    })
    // console.log(temp)
    return Object.values(temp).every(x => x === "")
  }


  const login = async () => {
    console.log(values)
    let response = await fetch("http://localhost:5000/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
    const data = await response.json()
    console.log(data)
    if (data.status === "ok") {
      localStorage.setItem('token', data.token)
      if (data.type === "vendor")
        window.location.href = "/Dashboard"
      else
        window.location.href = "/Dashboard"
    }
    else {
      alert("Invalid credentials")
    }
  }


  const handleSubmit = e => {
    // console.log("submit")
    e.preventDefault()
    // if (!validate())
    //     window.alert('testing...')
    // if (validate())
    // saveBuyer()
    if (validate())
      login()

  }
  return (
    <>
      <Paper className={classes.pageContent}>
        <Pageheader
          title="Login"
          // subtitle="Form Design"
          icon={<LoginIcon fontSize="large" />}
        />
        <Form onSubmit={handleSubmit}>
          <Grid container >
            <Grid item xs={12}>

              <Controls.Input
                name="email"
                label="Email"
                value={values.email}
                onChangeEvent={handleInputChange}
                error={errors.email}
              />
              <br />
              <Controls.Input
                name="password"
                label="Password"
                type="password"
                value={values.password}
                onChangeEvent={handleInputChange}
                error={errors.password} />
            </Grid>

            <Grid item >
              <Controls.Button
                type="submit"
                label="Login"
                text="Login"
                color="primary" />
            </Grid>
          </Grid>
        </Form>
      </Paper>
    </>
  )
}