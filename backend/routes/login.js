const express = require("express");
const router = express.Router();

const Vendor = require("../models/vendor");
const Buyer = require("../models/user");
const jwt = require("jsonwebtoken");

router.post('/', async function (req, res) {
    console.log(req.body);
    // console.log(req.body.openingTime)
    if (!req.body.email || !req.body.password) {
        return res.json({ status: "error", error: "NOT_ALL_FIELDS_PRESENT" });
    }
    var found = false;
    var toSend = {};
    try {
        const vendor = await Vendor.findOne({
            email: req.body.email,
            password: req.body.password
        }).clone();
        if (vendor) {
            const token = jwt.sign({
                id: vendor._id,
                email: vendor.email,
                type: "vendor"
            }, 'secret123');
            found = true;
            toSend = {
                status: "ok",
                type: "vendor",
                token: token,
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    if (!found) {
        try {
            const buyer = await Buyer.findOne({
                email: req.body.email,
                password: req.body.password
            })
            if (buyer) {
                const token = jwt.sign({
                    id: buyer._id,
                    email: buyer.email,
                    type: "buyer"
                }, 'secret123');
                found = true;
                let res1 = jwt.verify(token, 'secret123');
                toSend = {
                    status: 'ok',
                    type: "buyer",
                    token: token
                }
            }

        }
        catch (err) {
            console.log(err);
        }
    }
    if (!found) {
        res.json({ status: 'error', error: "INVALID_CREDENTIALS" })
    }
    else {
        console.log(toSend);
        res.json(toSend);
    }

});


module.exports = router;