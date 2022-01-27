import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

export function  UseForm(intialFValues) {
    const [values, setValues] = useState(intialFValues);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        })
    }
    const [errors, setErrors] = useState({})
    const resetFunciton = () => {
        setValues(intialFValues)
        setErrors({})
    }

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetFunciton
    }
}

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: "80%",
            margin: theme.spacing(1),
        }
    }
}))

export function Form(props) {
    const classes = useStyles();
    const { childeren, ...others } = props;
    return (
        <form className={classes.root} {...others}>
            {props.children}
        </form>
    )
}