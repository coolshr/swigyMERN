import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken';
import { useNavigate } from 'react-router-dom'
import Pageheader from '../components/pageHeader';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Paper, FormControl, FormHelperText, InputLabel, DialogActions, MenuItem, Select as MuiSelect, makeStyles, Toolbar, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, TableSortLabel, InputAdornment, FormGroup, Box, Typography, Grid, Dialog, DialogTitle, DialogContent, IconButton } from '@material-ui/core'
import { Controls } from "../components/controls/controls";
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { ButtonGroup, Switch } from '@mui/material';
import { FormControlLabel } from '@material-ui/core';
import { padding } from '@mui/system';
import { green, red } from '@mui/material/colors';
import { alpha, styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import Button from '../components/controls/Button';
import { Form } from '../components/useForm';
import BuyerdashBoar from './buyerDashboard';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { add } from 'date-fns';
import Fuse from 'fuse.js';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 0
}));

const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3)
  },
  dialogWrapper: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(5),
  },
  searchInput: {
    width: '75%'
  },
  table: {
    marginTop: theme.spacing(3),
    '& thead th': {
      fontWeight: '600',
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light,
    },
    '& tbody td': {
      fontWeight: '300',
    },
    '& tbody tr:hover': {
      backgroundColor: '#fffbf2',
      cursor: 'pointer',
    },
  },
}))

const GreenSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: green[600],
    '&:hover': {
      backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: green[600],
  },
}));

const RedSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: red[500],
    '&:hover': {
      backgroundColor: alpha(red[500], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: red[500],
  },
}));


const headCells = [
  { id: 'name', label: 'Name', disableSorting: true },
  { id: 'shopName', label: 'Shop Name', disableSorting: true },
  { id: 'veg', label: 'Veg/Non-Veg', disableSorting: true },
  { id: 'price', label: 'Price' },
  { id: 'rating', label: 'Rating' },
  { id: 'tags', label: 'Tags', disableSorting: true },
  { id: 'opened', label: 'Opened', disableSorting: true }
]

const Tags = [
  { id: 'spicy', label: 'Spicy', check: false },
  { id: 'hot', label: 'Hot', check: false },
  { id: 'popular', label: 'Popular', check: false },
  { id: 'cheese', label: 'Cheese', check: false },
  { id: 'fastFood', label: 'Fast Food', check: false },
  { id: 'healthy', label: 'Healthy', check: false },
  { id: 'special', label: 'Special', check: false }
]

export default function FoodMenu() {
  let navigate = useNavigate()
  const classes = useStyles();
  // var food = []
  // const [food, setFood] = useState();

  const pages = [5, 10, 25]
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [order, setOrder] = useState()
  const [orderBy, setOrderBy] = useState()
  const [veg, setVeg] = useState(true)
  const [nonveg, setNonveg] = useState(true)
  const [shops, setShops] = useState({})
  const [priceToShow, setPriceToShow] = useState(0)
  const [openPopup, setOpenPopup] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [addon, setAddon] = useState([])
  const [editFood, setEditFood] = useState(true)

  const [popupId, setpopupId] = useState({
    name: '',
    shopName: '',
    veg: '',
    rating: '',
    tags: [''],
    addons: [{ name: '', price: '' }],
    price: '',
    opened: ""
  })
  const [numAddon, setNumAddon] = useState(0)

  const [addAmount, setAddAmount] = useState(0)
  // const [addMoneyButton, setAddMoneyButton] = useState(true)
  // console.log(tagVar["cheese"])

  useEffect(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem('token');
        navigate('/login')
      }
      else {
        if (user.type !== "vendor")
          navigate('/login')
        else { }
      }
    }
    else {
      localStorage.clear()
      navigate('/login')
    }

  }, [])

  const handleTags = e => {
    // console.log(e.target.checked)
    console.log(e.target.id)
    if (e.target.checked) {
      setpopupId({
        ...popupId,
        tags: [...popupId.tags, e.target.id]
      })
    }
    else {
      setpopupId({
        ...popupId,
        tags: popupId.tags.filter(tag => tag !== e.target.id)
      })
    }
  }

  const handleChange = (e) => {
    setpopupId({
      ...popupId,
      [e.target.name]: e.target.value
    })
  }

  function checkTag(tag) {
    var tas = false
    // console.log(tag)
    popupId.tags.map(t => {
      if (t === tag) {
        tas = true
      }
    })
    return tas
  }
  function handleVeg(e) {
    setpopupId({
      ...popupId,
      veg: e.target.checked
    })
  }

  function handleDelete() {
    console.log(popupId.addons.length)
    if (popupId.addons.length === 0) return;
    setpopupId({ ...popupId, addons: [...popupId.addons.slice(0, popupId.addons.length - 1)] })
  }

  const [errors, setErrors] = useState({})

  function validate() {
    var temp = {};
    temp.name = popupId.name === "" ? "Name is required" : ""
    temp.price = popupId.price === "" ? "Price is required" : ""
    setErrors({
      ...temp
    })
    return Object.values(temp).every(x => x === "")
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate())
      return
    var toSend = {}
    toSend.name = popupId.name
    const toekn = localStorage.getItem('token')
    const decode = jwt.decode(toekn)
    toSend.vendor = decode.id
    toSend.price = parseInt(popupId.price)
    toSend.veg = popupId.veg === true ? true : false
    toSend.addons = []
    toSend.tags = []
    popupId.addons.map(addon => {
      if (addon.addon && addon.price)
        toSend.addons.push({ addon: addon.addon, price: addon.price })
    })
    popupId.tags.map(tag => {
      if (tag)
        toSend.tags.push({ tag: tag })

    })
    console.log(toSend)
    let resp = await fetch("http://localhost:5000/food/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': toekn,
      },
      body: JSON.stringify(toSend)
    })
    console.log(resp.json())
  }

  return (
    < Paper className={classes.pageContent} >
      <Pageheader
        title="Add Food"
        icon={<RestaurantMenuIcon />} />

      <Paper className={classes.pageContent}>
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={3} >
            <Grid xs={12}></Grid>
            <Grid item xs={6}>
              <Controls.Input
                name="name"
                label="Food Name"
                value={popupId.name}
                onChange={handleChange}
                error={errors.name} />
            </Grid>
            <Grid item xs={6}>
              <Controls.Input
                name="price"
                type="number"
                label="Price"
                value={popupId.price}
                onChange={handleChange}
                error={errors.price} />
            </Grid>

            <Grid item xs={6}>
              Non-veg<GreenSwitch
                onChange={handleVeg}
              />Veg
            </Grid>
            <Grid item xs={6}>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" color="text.secondary">
                Tags
              </Typography>
              {Tags.map((v, index) => (
                <FormControlLabel
                  key={index}
                  control={<Checkbox checked={checkTag(v.id)} id={v.id} onChange={handleTags} />}
                  label={v.label} />
              ))}
            </Grid>
          </Grid>
          <Grid container >
            <Grid item xs={12}>
              <Typography variant='h5'>Addons</Typography> <Button text="Add AddOn" onClick={() => setpopupId({ ...popupId, addons: [...popupId.addons, { '': ' ' }] })} />
              <Button text="Delete AddOn" color="secondary" onClick={() => handleDelete()} /></Grid>
            {popupId.addons.map((v, index) => (
              <>
                <Grid item xs={6}>
                  <Controls.Input
                    value={v.addon}
                    key={index}
                    onChange={(e) => setpopupId({ ...popupId, addons: [...popupId.addons.slice(0, index), { addon: e.target.value, price: v.price }, ...popupId.addons.slice(index + 1)] })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controls.Input
                    value={v.price}
                    key={index}
                    onChange={(e) => setpopupId({ ...popupId, addons: [...popupId.addons.slice(0, index), { addon: v.addon, price: e.target.value }, ...popupId.addons.slice(index + 1)] })}
                  />
                </Grid>
              </>
            ))}
          </Grid>
          <Button color="primary" text="Submit" type="submit" />
        </Form>
      </Paper>
    </Paper >

  )

}