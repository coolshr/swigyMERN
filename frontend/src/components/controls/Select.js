import React from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select as MuiSelect } from '@material-ui/core';

export default function Select(props) {
    const { name, label, value, onChange, error = null, items, ...others } = props;
    return (
        < FormControl
            variant="outlined"
            {...(error && { error: true })}>
            <InputLabel>{label}</InputLabel>
            <MuiSelect
                {...others}
                label={label}
                name={name}
                value={value}
                onChange={onChange} >
                {
                    items.map(
                        item => (<MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>)
                    )
                }

            </MuiSelect>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl >
    )
}