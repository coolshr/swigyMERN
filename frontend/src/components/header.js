import React from 'react';
import { InputBase, makeStyles } from "@material-ui/core"
import { withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Grid, IconButton, Badge } from '@material-ui/core';
import LoginIcon from '@mui/icons-material/Login';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const useStyles = makeStyles({
    root: {
        backgroundColor: "#fff"
    },
    searchInput: {
        opacity: '0.6',
        padding: '0px 8px',
        fontSize: '0.8rem ',
        '&:hover': {
            backgroundColor: '#f2f2f2',
        },
        '& .MuiSvgIcon-root': {
            marginRight: '8px'
        }
    }
})

export default function Header() {

    const classes = useStyles();
    return (
        <AppBar position='static' className={classes.root}>
            <Toolbar>
                <Grid container
                    alignItems='center'>
                    <Grid item  >
                        <InputBase
                            className={classes.searchInput}
                            placeholder='Search'
                            startAdornment={<SearchIcon fontSize='small' />} />
                    </Grid>
                    <Grid item sm />
                    <Grid item  >
                        <IconButton onClick={() => { window.location.href = "/login" }}>
                            <LoginIcon />
                        </IconButton>
                        <IconButton onClick={() => { window.location.href = "/" }}>
                            <PersonAddAltIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
} 