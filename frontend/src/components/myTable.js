

import React, { useState } from 'react'
import { Table, TableHead, TableRow, TableCell, makeStyles, TablePagination, TableSortLabel } from '@material-ui/core'





export default function MyTable(rows, headers, fn) {

    console.log(rows)

    const classes = useStyles();
    const pages = [5, 10, 25]
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [order, setOrder] = useState()
    const [orderBy, setOrderBy] = useState()

    const TblContainer = props => (<Table className={classes.table}>
        {props.children}
    </Table>)

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
                        headers.map(headCell => (
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
        rowsPerPage={pages}
        count={rows.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
    />)


    function stableSort(array, comparator) {
        if (array == null)
            return
        const stabilizedThis = array
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator(a, b, orderBy) {
        console.log(a)
        if (!orderBy)
            return 0;
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    const recordsAfterPagingAndSorting = () => {
        return stableSort(fn.fn(rows), getComparator(order, orderBy))
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    }

    return {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    }
}