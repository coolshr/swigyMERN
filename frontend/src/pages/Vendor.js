import React from 'react'
import { Grid } from "@material-ui/core";
import { UseForm, Form } from "../components/useForm";
import { Controls } from "../components/controls/controls";
import api from '../routes/auth/register';
import TimePicker from '@mui/lab/TimePicker';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import moment from 'moment';

const intialFVaues = {
    managerName: "",
    email: "",
    contactNumber: "",
    shopName: '',
    openingTime: Date.now(),
    closingTime: Date.now(),
    password: ""
}

export default function Vendor() {

    const { values, setValues, errors, setErrors, handleInputChange, resetFunciton } = UseForm(intialFVaues);
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

    const saveVendor = async () => {
        console.log(values.openingTime)
        const response = await fetch("http://localhost:5000/vendor/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });
        const data = await response.json();
        // console.log(data)
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
    }

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            saveVendor()
        }

    }

    const getVendors = async (event) => {
        event.preventDefault();
        const response = await fetch("http://localhost:5000/vendor", {
            method: 'GET'
        });
        const data = await response.json();
        const time1 = new Date(data[0].openingTime);
        const time2 = new Date(data[0].closingTime);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container >
                <Grid item xs={6}>
                    <Controls.Input
                        name="managerName"
                        label="Manager Name"
                        value={values.managerName}
                        onChangeEvent={handleInputChange}
                        error={errors.managerName} />
                    <Controls.Input
                        name="email"
                        label="Email"
                        value={values.email}
                        onChangeEvent={handleInputChange}
                        error={errors.email} />
                    <Controls.Input
                        type="password"
                        name="password"
                        label="Password"
                        value={values.password}
                        onChangeEvent={handleInputChange}
                        error={errors.password} />
                </Grid>
                <Grid item xs={6}>
                    <Controls.Input
                        name="shopName"
                        label="Shop Name"
                        value={values.shopName}
                        onChangeEvent={handleInputChange}
                        error={errors.shopName} />
                    <Controls.Input
                        name="contactNumber"
                        label="Mobile Number"
                        value={values.contactNumber}
                        onChangeEvent={handleInputChange}
                        error={errors.mobile} />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                            label="Opening Time"
                            name="openingTime"
                            value={values.openingTime}
                            onChange={handleTimeOpen}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <TimePicker
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
                    <Controls.Button
                        text="Reset"
                        color="default"
                        onClick={resetFunciton}
                    /><Controls.Button
                        text="Get"
                        color="default"
                        onClick={getVendors} />

                </Grid>
            </Grid>
        </Form>
    )
}