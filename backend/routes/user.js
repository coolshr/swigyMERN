const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
// const Order = require("../models/order");
// const vendor = require("../models/vendor");

router.get('/', async function (req, res) {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'secret123')
        const id = decoded.id
        const vendor = await User.findOne({ _id: id })
        res.json(vendor)
    }
    catch (err) {
        console.log(err)
        res.json({ status: "error", error: "INVALID_TOKEN" })
    }
});

router.post('/register', function (req, res) {
    if (!req.body.email || !req.body.name || !req.body.number || !req.body.age || !req.body.batch || !req.body.password) {
        return res.json({ status: "error", error: "NOT_ALL_FIELDS_PRESENT" });
    }
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        age: req.body.age,
        batch: req.body.batch,
        password: req.body.password
    });
    newUser.save()
        .then(item => {
            res.json({ status: "ok" });
        })
        .catch(err => { res.status(400).send(err) });

});

router.post('/update', async function (req, res) {
    if (!req.body.email || !req.body.name || !req.body.number || !req.body.age || !req.body.batch || !req.body.password) {
        return res.json({ status: "error", error: "NOT_ALL_FIELDS_PRESENT" });
    }
    const token = req.headers['x-access-token']
    try {
        const decode = jwt.verify(token, 'secret123')
        const id = decode.id
        const user = await User.findOne({ _id: id })
        user.password = req.body.password
        user.name = req.body.name
        user.batch = req.body.batch
        user.age = req.body.age
        user.email = req.body.email
        user.number = req.body.number
        const x = await user.save().then(item => { res.json(item) })
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
        res.send(err)
    }
})


router.post('/addMoney', async function (req, res) {
    console.log(req.body)
    if (!req.body.wallet) {
        return res.json({ status: "error", error: "NOT_ALL_FIELDS_PRESENT" });
    }
    const token = req.headers['x-access-token']
    try {
        const decode = jwt.verify(token, 'secret123')
        const id = decode.id
        const user = await User.findOne({ _id: id })
        user.wallet = user.wallet + parseInt(req.body.wallet)
        const x = await user.save().then(item => { res.json(item) })
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
        res.send(err)
    }
})



module.exports = router;