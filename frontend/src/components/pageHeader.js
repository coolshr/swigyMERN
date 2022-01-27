import React from 'react'
import { Card, Paper, Typography, makeStyles } from '@material-ui/core'


const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: "#fdfdff"
    },
    Pageheader: {
        padding: theme.spacing(4),
        marginBottom: theme.spacing(2),
        display: 'flex'
    },
    pageIcon: {
        display: 'inline-block',
        padding: theme.spacing(2),
        color: '#3c44b1'
    },
    pageTitle: {
        paddingLeft: theme.spacing(4),
        '& .MuiTypography-subtitle2': {
            opacity: '0.6'
        }

    }
}))


export default function Pageheader(props) {
    const classes = useStyles();
    const { title, subtitle, icon } = props;
    return (
        <Paper elevatoin={0} square className={classes.root}>
            <div className={classes.Pageheader}>
                <Card className={classes.pageIcon}>
                    {icon}
                </Card>
                <div className={classes.pageTitle}
                align="center">
                    <Typography
                        variant='h4'
                        component='div'
                        align="center">
                        {title}
                    </Typography>
                </div>
            </div>
        </Paper>
    );
}