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
  { id: 'shopName', label: 'Shop Name', disableSorting: true },
  { id: 'veg', label: 'Veg/Non-Veg', disableSorting: true },
  { id: 'quantity', label: 'Quantity', disableSorting: true },
  { id: 'rating', label: 'Rating', disableSorting: true },
  { id: 'addons', label: 'AddOns', disableSorting: true },
  { id: 'status', label: 'Status', disableSorting: true }
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
const [rating,setRating] = useState(0);

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
    addOn: [''],
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

  async function st() {
    let tempVendor = await axios.get('http://localhost:5000/vendor/all')
    let tempFood = await axios.get('http://localhost:5000/food/')
    let buyer = jwt.decode(localStorage.getItem('token'))

    let tO = await fetch('http://localhost:5000/order/getBuyerOrders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            user: buyer.id
        })
    })
    let tempOrders = await tO.json()
    console.log(tempOrders)
    tempOrders.map(f => {
      tempVendor.data.map(v => {
        if (f.vendor === v._id) {
          f["shopName"] = v.shopName
          f.opened = v["opened"]
        }
      })
      tempFood.data.map(f2 => {
          if(f.food === f2._id){
              f["name"] = f2.name
          }
      })
      if (f.veg)
        f["veg"] = "Veg"
      else
        f["veg"] = "Non-Veg"

    })
    setVendor(tempVendor.data)
    setFood(tempOrders)
    console.log(tempOrders)
  }

  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })

  // useEffect(async () => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     const user = jwt.decode(token);
  //     if (!user) {
  //       localStorage.removeItem('token');
  //       navigate('/login')
  //     }
  //     else {
  //       if (user.type !== "buyer")
  //         navigate('/login')
  //       else {
  //         const buyer = await fetch(`http://localhost:5000/user/`, {
  //           method: 'GET',
  //           headers: {
  //             'x-access-token': token
  //           }
  //         })
  //         const json = await buyer.json()
  //         setUser(json)
  //         st()
  //       }
  //     }
  //   }
  //   else {
  //     localStorage.clear()
  //     navigate('/login')
  //   }
  // }, [])

  useEffect(async ()=>{
    const iId = setInterval( async () =>{
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
    },3000)
    return ()=> clearInterval(iId)
  },[])

 const handleReady = async (item) =>{
    const x =await fetch('http://localhost:5000/order/status', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify({
          order: item._id,
          status: "COMPLETED"
      })
  })
}


 async function  handleRate(item) {
   console.log(item)
 await fetch('http://localhost:5000/order/rate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      order: item._id,
      rate: item.rating
    })
  })
//   return;
}

const handleRating = (e) => {console.log(e.target.value)}
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
                  <TableCell>{item.shopName}</TableCell>
                  <TableCell>{item.veg}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{<Rating name="no-value" value={item.rating} onChange={(e)=>{setFood(  [...food.slice(0,index) , {...food[index],"rating":parseInt(e.target.value)},...food.slice(index+1,food.length)]  )}}  disabled={(item.status == "COMPLETED"?false:true)} /> }</TableCell>
                  <TableCell>{item.addOn.map((tag, ind) => <div key={ind}>{tag.addon}</div>)}</TableCell>
                  <TableCell>{(item.status == "READY FOR PICKUP"?<Button text="Ready for pickup" size="small" onClick={(e)=>{e.preventDefault();handleReady(item)}}></Button> : item.status)}</TableCell>
                  <TableCell>{(item.status == "COMPLETED" && !item.rated?<Button  text="Rate" size="small" onClick={(e)=>{e.preventDefault();handleRate(item)}}></Button> : <></>)}</TableCell>
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