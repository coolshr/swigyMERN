import React from 'react';
import { IconButton, makeStyles, Typography } from "@material-ui/core"
import { withStyles } from '@material-ui/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import List from '@mui/material/List';
import SideList from './sideList';

const sideMenuStyle = {
    sideMenu: {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        left: "0px",
        width: "320px",
        height: "100%",
        backgroundColor: "#253053"
    }

}

const Real = (props) => {
    return (
        <List>
            <SideList text={"Dashboard"} icon={<DashboardIcon sx={{color:"white"}}/>}  link={"/Dashboard"}  />
        </List>
    )
}



const SideMenu = (props) => {
    // const classes = sideMenuStyle();
    const { classes } = props;
    if (localStorage.getItem("token")) {
        return (
            <div className={classes.sideMenu}>
                <Real />
            </div>
        );
    }
    else {
        return (
            <div className={classes.sideMenu}>
            </div>)
    }
}

export default withStyles(sideMenuStyle)(SideMenu);