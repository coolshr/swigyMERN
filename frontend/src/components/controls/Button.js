import React from 'react'
import { Button as MuiButton, makeStyles } from '@material-ui/core'


const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(1)
    },
}))

export default function Button(props) {

    const { text, size, color, onClick, variant, ...other } = props;
    const classes = useStyles();
    return (
        <MuiButton
            variant={variant || "contained"}
            size={size || "large"}
            color={color || "primary"}
            onClick={onClick}
            {...other}
            classes={{ root: classes.root }}>
            {text}
        </MuiButton>
    )
}