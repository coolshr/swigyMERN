import React from 'react';
import { TextField } from '@material-ui/core';

export default function Input(props) {

    const { name, label, value, error = null, onChangeEvent, ...other } = props;

    return (

        <TextField
            variant="outlined"
            label={label}
            name={name}
            value={value}
            onChange={onChangeEvent}
            {...(error && { error: true, helperText: error })}
            {...other}
        />

    )
}