import React from 'react';
import { IconButton, makeStyles, Typography } from "@material-ui/core"
import { withStyles } from '@material-ui/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Link from '@mui/material/Link';

const style = makeStyles(theme => ({
    root: {
        // '& .MuiListItemText-root': {
        color: "white"
        // }
    },
    icon: {
        color: "white"
    }
}));


export default function SideList(props) {
    const { icon, text, link } = props
    console.log(link)
    const classes = style();
    return (
        <Link href={link} underline="none">
            <ListItem button key={text}  >
                <ListItemIcon >{icon}</ListItemIcon>
                <ListItemText primary={text} className={classes.root} />
            </ListItem>  
        </Link>

    )
}