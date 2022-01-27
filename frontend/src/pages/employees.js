import React from 'react'
import SignUpForm from './employeeForm'
import { makeStyles, Paper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    }
}))


export default function SignUp() {

    const classes = useStyles();

    return (
        <>

            <Paper className={classes.pageContent}>
                <SignUpForm />
            </Paper>
        </>
    )
}