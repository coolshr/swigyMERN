import Rating from '@mui/material/Rating';
import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken';
import { useNavigate } from 'react-router-dom'
import Pageheader from '../components/pageHeader';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Paper, FormControl, FormHelperText, InputLabel, DialogActions, MenuItem, Select as MuiSelect, makeStyles, Toolbar, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, TableSortLabel, InputAdornment, FormGroup, Box, Typography, Grid, Dialog, DialogTitle, DialogContent, IconButton } from '@material-ui/core'
import { ButtonGroup, Switch } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { alpha, styled } from '@mui/material/styles';
import createPlotlyComponent from "react-plotly.js/factory";
import axios from 'axios';
import Plotly from "plotly.js-basic-dist";


const Plot = createPlotlyComponent(Plotly);

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
  { id: 'price', label: 'Price', disableSorting: true },
  { id: 'orders', label: 'Orders', disableSorting: true },
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
  const [totalOrders,setTotalOrders] = useState(0)
  const [pendingOrders,setPendingOrders] = useState(0)
  const [completedOrders,setCompletedOrders] = useState(0)
  const [batchOrders,setBatchOrders] = useState([
      0,0,0,0,0
  ])
  const [ageOrders, setAgeOrders] = useState(Array(100).fill(0))
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

    let tO = await fetch('http://localhost:5000/vendor/stats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            vendorId: buyer.id
        })
    })
    let tempOrders = await tO.json()
    console.log(tempOrders)
    tempOrders.topMenu.map(f => {
          f["shopName"] = user.shopName 
          if (f.veg)
        f["veg"] = "Veg"
      else
        f["veg"] = "Non-Veg"
    })
    let ts= await fetch('http://localhost:5000/order/getVendorOrders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            vendor: buyer.id
        })
    })
    var lcomp = 0, lplace = 0, lpending = 0
    let tSS = await ts.json()
    var lBatchOrders = [0,0,0,0,0]
    var lAgeOrders = Array(100).fill(0)
    console.log(tSS)
    tSS.map(f => {
        if(f.status == "COMPLETED" ){
            lcomp+=f.quantity
            if(f.batch == "UG1")
            lBatchOrders[0]+=f.quantity
            else if(f.batch == "UG2")
            lBatchOrders[1]+=f.quantity
            else if(f.batch == "UG3")
            lBatchOrders[2]+=f.quantity
            else if(f.batch == "UG4")
            lBatchOrders[3]+=f.quantity
            else if(f.batch == "UG5")
            lBatchOrders[4]+=f.quantity
            lAgeOrders[f.age]+=f.quantity
        }
        if(f.status == "COOKING" || f.status == "ACCEPTED" || f.status == "READY FOR PICKUP")
        lpending +=f.quantity
        lplace +=f.quantity
    })
    setPendingOrders(lpending)
    setCompletedOrders(lcomp)
    setTotalOrders(lplace)
    setVendor(tempVendor.data)
    setFood(tempOrders.topMenu)
    setBatchOrders(lBatchOrders)
    setAgeOrders(lAgeOrders)
    console.log(tempOrders)
    console.log(lBatchOrders)
    console.log(lAgeOrders)
  }

  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })

  useEffect(async () => {
    const iId = setInterval(async ()=>{const token = localStorage.getItem('token');
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
    }},1000)
    return () => clearInterval(iId)
  }, [])

var  ages = Array(100).fill(0)
for(var i=0;i<ages.length;i++){
    ages[i] = i+1
}
console.log(ages)
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
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.orders}</TableCell>
                  </TableRow>
              )
              )
            }
          </TableBody>
        </TblContainer>
        <br></br>
        <Typography>Total Orders = {totalOrders}</Typography>
        <Typography>Pending Orders = {pendingOrders}</Typography>
        <Typography>Completed Orders = {completedOrders}</Typography>
      </Paper>
      <Plot
        data={[
            {
                x: ['UG1', 'UG2', 'UG3', 'UG4', 'UG5'],
                y: batchOrders,
                type: 'bar',
            }
        ]}
      />
      <br/>
      <Plot
      data={[
          {
              x: ages,
              y: ageOrders,
              type: 'bar',
          }
      ]}
    />
    </Paper >
  )
}