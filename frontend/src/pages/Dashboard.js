import React, { useEffect } from 'react'
import VendorDashboard from './vendorDashboard'
import BuyerDashboard from './buyerDashboard'
import jwt from 'jsonwebtoken';
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    var type;
    let navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const user = jwt.decode(token);
            // console.log(user
            // alert(user)
            if (!user) {
                localStorage.removeItem('token');
                navigate('/login')
            }
            else {
                if (user.type === "buyer") {
                    window.location.href = '/buyerDashboard'
                }
                else if (user.type === "vendor")
                    window.location.href = '/vendorDashboard'
                else
                navigate('/login')
            }
        }
        else {
            navigate('/login')
        }
    }, [])

    return (
        <>

        </>
    )
}