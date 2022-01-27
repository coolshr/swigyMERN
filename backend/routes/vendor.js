const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const helper = require("../helper/helper");
const Vendor = require("../models/vendor");

router.get('/all', function (req, res) {
    Vendor.find(function (err, vendor) {
        if (err) {
            console.log(err);
        } else {
            res.json(vendor);
        }
    })
});

router.post('/register', function (req, res) {
    if (!req.body.email || !req.body.managerName || !req.body.shopName || !req.body.contactNumber || !req.body.openingTime || !req.body.closingTime || !req.body.password) {
        return res.status(400).json({ error: "NOT_ALL_FIELDS_PRESENT" });
    }
    const newVendor = new Vendor({
        email: req.body.email,
        managerName: req.body.managerName,
        shopName: req.body.shopName,
        password: req.body.password,
        contactNumber: req.body.contactNumber,
        openingTime: req.body.openingTime,
        closingTime: req.body.closingTime
    });
    newVendor.save()
        .then(item => { res.json(item) })
        .catch(err => {
            console.log(err);
            if (err.code === 11000) {
                if (err.keyPattern.email) {
                    return res.json({ status: 'error', error: "EMAIL_ALREADY_EXISTS" })
                }
                if (err.keyPattern.shopName) {
                    return res.json({ status: 'error', error: "SHOP_NAME_ALREADY_EXISTS" })
                }
            }
            else { res.status(400).send(err) }
        });
});

router.get('/', async function (req, res) {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'secret123')
        const id = decoded.id
        const vendor = await Vendor.findOne({ _id: id })
        res.json(vendor)
    }
    catch (err) {
        console.log(err)
        res.json({ status: "error", error: "INVALID_TOKEN" })
    }

});

router.post('/update', async function (req, res) {
    if (!req.body.email || !req.body.managerName || !req.body.shopName || !req.body.contactNumber || !req.body.openingTime || !req.body.closingTime || !req.body.password) {
        return res.json({ status: "error", error: "NOT_ALL_FIELDS_PRESENT" });
    }
    const token = req.headers['x-access-token']
    console.log(token)
    try {
        const decode = jwt.verify(token, 'secret123')
        console.log(decode)
        const id = decode.id
        console.log(id)
        let res1 = helper(Vendor, id);
        const vendor = await Vendor.findOne({ _id: id })
        if (!res1) {
            return res.send({ status: "error", error: "NOT_AUTHORISED" })
        }
        vendor.password = req.body.password
        vendor.managerName = req.body.managerName
        vendor.shopName = req.body.shopName
        vendor.openingTime = req.body.openingTime
        vendor.closingTime = req.body.closingTime
        vendor.email = req.body.email
        vendor.contactNumber = req.body.contactNumber
        const x = await vendor.save().then(item => { res.json(item) })
            .catch(err => {
                console.log(err);
                if (err.code === 11000) {
                    if (err.keyPattern.email) {
                        return res.json({ status: 'error', error: "EMAIL_ALREADY_EXISTS" })
                    }
                    if (err.keyPattern.shopName) {
                        return res.json({ status: 'error', error: "SHOP_NAME_ALREADY_EXISTS" })
                    }
                }
                else { res.status(400).send(err) }
            });;
    }
    catch (err) {
        // console.log(err)
        res.send({ status: "error", error: "AUTHENTICATION_FAILED" })
    }
})


module.exports = router;