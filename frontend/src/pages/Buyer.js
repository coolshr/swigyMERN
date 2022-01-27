import React from 'react'
import { Grid } from "@material-ui/core";
import { UseForm, Form } from "../components/useForm";
import { Controls } from "../components/controls/controls";

const intialFVaues = {
    name: '',
    email: "",
    number: "",
    batch: '',
    age: '',
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

    const {
        values,
        setValues,
        handleInputChange,
        errors,
        setErrors,
        resetFunciton
    } = UseForm(intialFVaues);


    const validate = () => {
        let temp = {}
        temp.name = values.name ? "" : "This field is required"
        temp.email = (/.+@.+\.[A-Za-z]+$/).test(values.email) ? "" : "Invalid Email"
        temp.number = values.number.length == 10 ? "" : "Incoorect number"
        temp.batch = values.batch.length != 0 ? "" : "This field is required"
        temp.age = values.age.length != 0 ? "" : "This field is required"
        temp.password = values.password.length >= 8 ? "" : "Password must be atleast 8 characters long"
        // console.log(temp)
        setErrors({
            ...temp
        })
        // console.log(temp)
        return Object.values(temp).every(x => x === "")
    }
    const saveBuyer = async () => {
        // console.log(values)
        const response = await fetch("http://localhost:5000/user/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });
        const data = await response.json();
        // console.log(data)
        if (data.status == "ok") {
            alert("User Created")
        }
        if (data.status == "error") {
            if (data.error == "EMAIL_ALREADY_EXISTS") {
                setErrors({
                    ...errors,
                    email: "Email already exists"
                })
            }
        }
    }

    const handleSubmit = e => {
        // console.log("submit")
        e.preventDefault()
        // if (!validate())
        //     window.alert('testing...')
        if (validate())
            saveBuyer()
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container >
                <Grid item xs={6}>
                    <Controls.Input
                        name="name"
                        label="Full Name"
                        value={values.name}
                        onChangeEvent={handleInputChange}
                        error={errors.name} />
                    <Controls.Input
                        name="email"
                        label="Email"
                        value={values.email}
                        onChangeEvent={handleInputChange}
                        error={errors.email}
                    />


                </Grid>
                <Grid item xs={6}>
                    <Controls.Select
                        name="batch"
                        label="Batch"
                        value={values.batch}
                        onChange={handleInputChange}
                        items={BatchList()}
                        error={errors.batch}
                    />
                    <Controls.Input
                        name="number"
                        label="Mobile Number"
                        value={values.number}
                        onChangeEvent={handleInputChange}
                        error={errors.number} />
                    <Controls.Input
                        name="age"
                        label="Age"
                        type="number"
                        value={values.age}
                        onChangeEvent={handleInputChange}
                        error={errors.age} />
                    <Controls.Input
                        name="password"
                        label="Password"
                        type="password"
                        value={values.password}
                        onChangeEvent={handleInputChange}
                        error={errors.password} />
                </Grid>
                {/* <Grid item ></Grid> */}
                <Grid item container justifyContent='center' direction='row'>
                    <br />
                    <Controls.Button
                        type="submit"
                        text="Submit"
                    />
                    <Controls.Button
                        text="Reset"
                        color="default"
                        onClick={resetFunciton}
                    />
                </Grid>
                {/* <Grid item ></Grid> */}
            </Grid>
        </Form>
    )
}