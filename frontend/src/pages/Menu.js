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
  { id: 'spicy', label: 'Spicy' },
  { id: 'hot', label: 'Hot' },
  { id: 'popular', label: 'Popular' },
  { id: 'cheese', label: 'Cheese' },
  { id: 'fastFood', label: 'Fast Food' },
  { id: 'healthy', label: 'Healthy' },
  { id: 'special', label: 'Special' }
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
  const [popupId, setpopupId] = useState({
    name: '',
    shopName: '',
    veg: '',
    rating: '',
    tags: [''],
    addons: [''],
    price: '',
    opened: ""
  })

  const [food, setFood] = useState([{
    name: '',
    shopName: '',
    veg: '',
    rating: '',
    tags: [''],
    addons: [''],
    price: '',
    opened: ""
  }])
  console.log(popupId)

  const [tagVar, setTagVar] = useState({
    spicy: true,
    hot: true,
    popular: true,
    cheese: true,
    fastFood: true,
    healthy: true,
    special: true
  })
  const [user, setUser] = useState({
    name: '',
    email: "",
    number: "",
    age: '',
    batch: "",
    password: "",
    wallet: 0
  })
  const [addAmount, setAddAmount] = useState(0)
  // const [addMoneyButton, setAddMoneyButton] = useState(true)
  // console.log(tagVar["cheese"])
  const [vendor, setVendor] = useState([{
    managerName: '',
    shopName: '',
    contactNumber: '',
    openingTime: '',
    closingTime: ''
  }])


  const TblContainer = props => {
    return (
      <Table className={classes.table}>
        {props.children}
      </Table>)
  }

  const TblHead = props => {
    const handleSortReq = cellId => {
      const isAsc = orderBy === cellId && order === 'asc'
      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(cellId)
    }


    return (
      <TableHead>
        <TableRow>
          {
            headCells.map(headCell => (
              <TableCell key={headCell.id}
                sortDirection={orderBy === headCell.id ? order : false}>
                {headCell.disableSorting ? headCell.label :
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => { handleSortReq(headCell.id) }}>
                    {headCell.label}
                  </TableSortLabel>
                }
              </TableCell>
            ))
          }
        </TableRow>
      </TableHead>
    )
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0);
  }

  const TblPagination = () =>
  (<TablePagination
    component="div"
    page={page}
    rowsPerPageOptions={pages}
    rowsPerPage={rowsPerPage}
    count={food.length}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
  />)



  const customSort = (order, orderBy) => {
    if (!order)
      return function (a, b) { return 0 }
    else
      return function (a, b) {
        if (order === 'desc') {
          return b[orderBy] - a[orderBy]
        }
        else
          return a[orderBy] - b[orderBy]
      }
  }


  const recordsAfterPagingAndSorting = () => {
    // return stableSort(fn.fn(food), getComparator(order, orderBy))
    //   .slice(page * rowsPerPage, (page + 1) * rowsPerPage)\
    const arr = filterTags(showVeg(filterShops(filterFn.fn(food)))).sort(customSort(order, orderBy))
    var arr1 = []
    var arr2 = []
    arr.map(x => {
      if (x["opened"] === "Open")
        arr1.push(x)
      else
        arr2.push(x)
    })
    const finalArr = [...arr1, ...arr2]
    return finalArr.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
  }

  console.log(food)
  async function st() {
    let tempVendor = await axios.get('http://localhost:5000/vendor/all')
    let tempFood = await axios.get('http://localhost:5000/food/')
    var tempShops = {}
    console.log(tempFood.data)
    tempVendor.data.map(v => {
      v["open"] = {
        Hours: new Date(v.openingTime).getHours(),
        Min: new Date(v.openingTime).getMinutes()
      }

      v["close"] = {
        Hours: new Date(v.closingTime).getHours(),
        Min: new Date(v.closingTime).getMinutes()
      }
      var t = new Date()
      console.log(t)
      console.log(v.open)
      console.log(v.close)
      var time = {
        Hours: t.getHours(),
        Min: t.getMinutes()
      }
      v["opened"] = "Closed"
      var openTimeCor = false
      var closeTimeCor = false
      if (time.Hours > v["open"].Hours || (time.Hours == v["open"].Hours && time.Min >= v["open"].Min))
        openTimeCor = true
      if (time.Hours < v["close"].Hours || (time.Hours == v["close"].Hours && time.Min <= v["close"].Min))
        closeTimeCor = true
      if (openTimeCor && closeTimeCor)
        v["opened"] = "Open"
      console.log(t.getHours())
      // v["opened"] = true
      console.log(v)
      tempShops[v.shopName] = true
    })
    tempFood.data.map(f => {
      tempVendor.data.map(v => {
        if (f.vendor === v._id) {
          f["shopName"] = v.shopName
          f.opened = v["opened"]
        }
      })
      if (f.veg)
        f["veg"] = "Veg"
      else
        f["veg"] = "Non-Veg"

    })

    setShops(tempShops)
    setVendor(tempVendor.data)
    setFood(tempFood.data)
  }


  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })


  const handleSearch = e => {
    let target = e.target
    setFilterFn({
      fn: items => {
        if (target.value === "")
          return items;
        const fuse = new Fuse(items, {
          keys: ['name'],
          score: 0.3
        })
        const ans = fuse.search(e.target.value).map(x => x.item)
        console.log(ans)
        return ans
      }
    })
  }

  useEffect(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem('token');
        navigate('/login')
      }
      else {
        if (user.type !== "buyer")
          navigate('/login')
        else {
          const buyer = await fetch(`http://localhost:5000/user/`, {
            method: 'GET',
            headers: {
              'x-access-token': token
            }
          })
          const json = await buyer.json()
          setUser(json)
          st()
        }
      }
    }
    else {
      localStorage.clear()
      navigate('/login')
    }

  }, [])
  const showVeg = items => {
    return items.filter(x => {
      if (veg && x.veg === "Veg")
        return x
      if (nonveg && x.veg === "Non-Veg")
        return x
    })
  }
  const handleVeg = e => {
    // setVeg(e.target.checked)
    // setNonveg(e.target.checked)
    setVeg(document.getElementById("greenSwitch").checked)
    setNonveg(document.getElementById("greenSwitch").checked)
    if (!document.getElementById("greenSwitch").checked && !document.getElementById("redSwitch").checked) {
      setVeg(true)
      setNonveg(true)
    }
  }

  const handleCheck = e => {
    // console.log(tempShops)
    setShops({ ...shops, [e.target.id]: e.target.checked })
  }

  const filterShops = items => {
    return items.filter(x => {
      if (shops[x.shopName] == true)
        return x
    })
  }

  const filterTags = items => {
    return items.filter(x => {
      var r = false
      x.tags.map(t => {
        if (tagVar[t["tag"]] == true)
          r = true
      })
      if (r == true)
        return x
    })
  }

  const handleTags = e => {
    console.log(e.target.checked)
    setTagVar({
      ...tagVar,
      [e.target.id]: e.target.checked
    })
  }

  function rand(id) {
    var temp = food.filter(x => x._id === id)
    if (temp[0]["opened"] === "Open") {
      setpopupId(temp[0])
      setOpenPopup(true)
      setPriceToShow(temp[0].price)
      setQuantity(1)
    }
    else {
      alert("Shop is closed")
    }
  }
  async function placeOrder(e) {
    var token = localStorage.getItem('token');
    var usr = jwt.decode(token);

    var toSend = {
      food: popupId._id,
      quantity: quantity,
      vendor: popupId.vendor,
      user: usr.id,
      addOn: [],
      price: priceToShow
    }
    if(user.wallet < priceToShow*quantity)
    {
      alert("Insufficient Balance")
      return
    }
    if (addon.length > 0)
      addon.map(a => { toSend.addOn.push({ addon: a }) })
    console.log(toSend)
    let response = await fetch("http://localhost:5000/order/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(toSend)
    })
    setOpenPopup(false)
    setAddon([])
    // console.log(response)
  }

  function handleAddon(e) {
    if (e.target.checked) {
      setAddon([...addon, e.target.id])
      setPriceToShow(priceToShow + parseInt(e.target.value))
    }
    else {
      setAddon(addon.filter(x => x !== e.target.id))
      setPriceToShow(priceToShow - parseInt(e.target.value))
    }
  }
  async function addMoneyFunc() {
    const token = localStorage.getItem('token');
    const toSend = {
      wallet: parseInt(addAmount)
    }
    console.log(toSend)
    const response = await fetch(`http://localhost:5000/user/addMoney`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify(toSend)
    });
    console.log(response.json())
    setUser({ ...user, wallet: user.wallet + parseInt(addAmount) })
  }

  return (
    < Paper className={classes.pageContent} >
      <Pageheader
        title="Food Menu"
        icon={<RestaurantMenuIcon />} />

      <Paper className={classes.pageContent}>
        <Controls.Input
          label="Money"
          disabled={true}
          value={user.wallet} />
        <Controls.Input
          label="Add Money"
          value={addAmount}
          onChange={e => { setAddAmount(e.target.value) }} />
        <Button text="add money" onClick={addMoneyFunc}> </Button>

        <Toolbar>
          <Controls.Input
            label="Search"
            InputProps={{
              startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>)
            }}
            onChange={handleSearch}
            className={classes.searchInput} />
          <br />
        </Toolbar>
        <Toolbar>
          <FormControlLabel control={
            <GreenSwitch id="greenSwitch" onChange={handleVeg} />} label="Veg" />
          <FormControlLabel control={
            <RedSwitch id="redSwitch" onChange={handleVeg} />} label="Non-Veg" />
        </Toolbar>


        <FormGroup>
          <Grid container >
            <Grid item xs={6}>
              <Typography variant='h5'>Shop</Typography>
              {vendor.map((v, index) => (
                <FormControlLabel key={index} control={
                  <Checkbox defaultChecked id={v.shopName} onChange={handleCheck} />} label={v.shopName} />
              ))}
            </Grid>
            <Grid item xs={6}>
              <Typography variant='h5'>Tags</Typography>
              {Tags.map((v, index) => (
                <FormControlLabel key={index} control={
                  <Checkbox defaultChecked id={v.id} onChange={handleTags} />} label={v.label} />
              ))}</Grid>
          </Grid>



        </FormGroup>

        <TblContainer>
          <TblHead />
          <TableBody>
            {
              recordsAfterPagingAndSorting().map((item, index) =>
              (
                <TableRow key={index} id={item._id} onClick={() => { rand(item._id) }}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.shopName}</TableCell>
                  <TableCell>{item.veg}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.rating}</TableCell>
                  <TableCell>{item.tags.map((tag, ind) => <div key={ind}>{tag.tag}</div>)}</TableCell>
                  <TableCell>{item.opened}</TableCell>
                </TableRow>
              )
              )
            }
          </TableBody>
        </TblContainer>
      </Paper>
      <TblPagination />
      <Paper className={classes.pageContent}>
        <Dialog
          open={openPopup}
          onBackdropClick={() => setOpenPopup(false)}>
          <DialogTitle>Order</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3} >
              <Grid xs={12}></Grid>
              <Grid item xs={6}>
                <Controls.Input
                  name="name"
                  disabled={true}
                  label="Full Name"
                  value={popupId.name} />
              </Grid>
              <Grid item xs={6}>
                <Controls.Input
                  name="price"
                  disabled={true}
                  label="Price"
                  value={popupId.price} />
              </Grid>
              <Grid item xs={6}>
                <Controls.Input
                  name="rating"
                  disabled={true}
                  label="Rating"
                  value={popupId.rating} />
              </Grid>
              <Grid item xs={6}>
                <Controls.Input
                  name="shopName"
                  disabled={true}
                  label="Shop Name"
                  value={popupId.shopName} />
              </Grid>
              <Grid item xs={6}>
                <Controls.Input
                  name="veg"
                  disabled={true}
                  label="Veg/Non-Veg"
                  value={popupId.veg} />
              </Grid>
              <Grid item xs={6}>
                <ButtonGroup>
                  <IconButton onClick={() => setQuantity(quantity - 1 > 0 ? quantity - 1 : 1)}><RemoveIcon /></IconButton>
                  <Typography variant="h5" color="text.secondary">
                    {quantity}
                  </Typography>
                  <IconButton onClick={() => setQuantity(quantity + 1)}><AddIcon /></IconButton>
                </ButtonGroup>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5" color="text.secondary">
                  Tags
                </Typography>
                {popupId.tags.map((tag, ind) =>
                  <Typography variant="h6" color="text.secondary">
                    {tag.tag}
                  </Typography>)}
              </Grid>
              <Grid item xs={6}>
                <Typography variant='h5'>Addons</Typography>
                {popupId.addons.map((v, index) => (
                  <FormControlLabel key={index} control={
                    <Checkbox value={v.price} defaultChecked={false} id={v.addon} onChange={handleAddon} />} label={`${v.addon} - ${v.price}`} />
                ))}
              </Grid>
              <Grid item xs={6}>
                <Controls.Input
                  name="price"
                  disabled={true}
                  label="Price"
                  value={priceToShow * quantity} />
              </Grid>
            </Grid>
            <DialogActions>
              <IconButton onClick={placeOrder}><ShoppingBagIcon /></IconButton>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Paper>
    </Paper >

  )

}