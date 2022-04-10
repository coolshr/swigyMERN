import Rating from '@mui/material/Rating';
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
  { id: 'veg', label: 'Veg/Non-Veg', disableSorting: true },
  { id: 'quantity', label: 'Quantity', disableSorting: true },
  { id: 'stutus', label: 'Status', disableSorting: true },
  { id: 'placedAt', label: 'PlacedAt', disableSorting: true },
  { id: 'addons', label: 'Add Ons', disableSorting: true },
  { id: 'moveToNext', label: 'Action', disableSorting: true },
  { id: 'cancel', label: 'Cancel', disableSorting: true }
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

// function Rate(props){
//   const {item} = props;
//   if(item.status == "COMPLETED")
//   return(
//     <Button text="rate"  />
//   )
// }

export default function FoodMenu() {
  const [rating, setRating] = useState(0);

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
  const [numOrders,setNumOrders]  = useState(0)
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
    addOn: [''],
    price: '',
    opened: ""
  }])

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

  async function st() {
    let tempVendor = await axios.get('http://localhost:5000/vendor/all')
    let tempFood = await axios.get('http://localhost:5000/food/')
    let buyer = jwt.decode(localStorage.getItem('token'))

    let tO = await fetch('http://localhost:5000/order/getVendorOrders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vendor: buyer.id
      })
    })
    let tempOrders = await tO.json()
    var lnumorders  = 0
    tempOrders.map(f => {
      f["shopName"] = user.shopName
     
      tempFood.data.map(f2 => {
        if (f.food === f2._id) {
          f["name"] = f2.name
        }
        if (f2.veg)
          f["veg"] = "Veg"
        else
          f["veg"] = "Non-Veg"
        if (f.status == "ACCEPTED" || f.status == "COOKING")
        lnumorders += 1
      })
      var timedate = new Date(f.placedAt)
      f['timeToShow'] = String(timedate.getDate()).padStart(2, '0') + '-' + String(timedate.getMonth() + 1).padStart(2, 0) + '-' + timedate.getFullYear() + ' ' + String(timedate.getHours()).padStart(2, '0') + ':' + String(timedate.getMinutes()).padStart(2, '0')
      // f['timeToShow'] = timedate.format("dd-mm-yyyy hh:MM TT")

    })
    setVendor(tempVendor.data)
    setFood(tempOrders)
    setNumOrders(lnumorders)
  }

  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })

  useEffect(async () => {
    const iId = setInterval(async () => {
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
          else {
            const buyer = await fetch(`http://localhost:5000/vendor/`, {
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
    }, 1000)
    return () => clearInterval(iId)
  }, [])
  console.log(numOrders)
  const handleReady = async (item) => {
    var nextStatus;
    if (item.status == "PLACED") {
      if (numOrders >= 10) {
        alert("You have reached the maximum number of orders")
        return
      }
      nextStatus = "ACCEPTED"
      setNumOrders(numOrders + 1)
    }
    else if (item.status == "ACCEPTED")
      nextStatus = "COOKING"
    else if (item.status == "COOKING") {
      nextStatus = "READY FOR PICKUP"
      setNumOrders(numOrders - 1) 
    }
    const x = await fetch('http://localhost:5000/order/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order: item._id,
        status: nextStatus
      })
    })
  }

  const handleCancel = async (item) => {
    const x = await fetch('http://localhost:5000/order/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order: item._id,
        status: "REJECTED"
      })
    })
  }
  
  return (
    < Paper className={classes.pageContent} >
      <Pageheader
        title="Food Menu"
        icon={<RestaurantMenuIcon />} />
      <Paper className={classes.pageContent}>
        <TblContainer>
          <TblHead />
          <TableBody>
            {
              food.map((item, index) =>
              (
                <TableRow key={index} >
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.veg}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.timeToShow}</TableCell>
                  <TableCell>{item.addOn.map((tag, ind) => <div key={ind}>{tag.addon}</div>)}</TableCell>
                  <TableCell>{(item.status != "READY FOR PICKUP" && item.status != "COMPLETED" ? <Button text="Move to next stage" size="small" onClick={(e) => { e.preventDefault(); handleReady(item) }}></Button> : <></>)}</TableCell>
                  <TableCell>{(item.status == "PLACED" ? <Button text="CANCEL" size="small" color="secondary" onClick={(e) => { e.preventDefault(); handleCancel(item) }}></Button> : <></>)}</TableCell>
                </TableRow>
              )
              )
            }
          </TableBody>
        </TblContainer>
      </Paper>
    </Paper >
  )
}