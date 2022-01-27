const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const Vendor = require("../models/vendor");
const Food = require("../models/food");
const helper = require("../helper/helper");
const jwt = require("jsonwebtoken");

router.get('/', async function (req, res) {
    try {
        let food = await Food.find({});
        res.json(food);
    }
    catch (err) {
        console.log(err)
    }
});


router.post('/', async function (req, res) {
    console.log(!req.body.veg)

    // if (!req.body.name || !req.body.vendor || !req.body.price || !req.body.veg) {
    //     return res.status(400).json({ "error": "NOT_ALL_FIELDS_PRESENT" });
    // }
    // console.log(req.body)

    const newFood = new Food({
        name: req.body.name,
        vendor: req.body.vendor,
        price: req.body.price,
        veg: req.body.veg,
        addons: req.body.addons,
        tags: req.body.tags
    });
    // console.log(newFood)
    let resp = await helper(Vendor, req.body.vendor);
    if (!resp)
        return res.status(400).json({ "error": "INVALID_ID_VENDOR" });
    else {
        console.log("saving fod");
        newFood.save(function (err, food) {
            if (err) {
                console.log(err)
                return res.status(400).json(err);
            } else {
                return res.status(200).json(food);
            }
        })
    }
});

router.post('/rating', async function (req, res) {
    if (!req.body.food || !req.body.rating) {
        return res.status(400).json({ "error": "NOT_ALL_FIELDS_PRESENT" });
    }
    let resp = await helper(Food, req.body.food);
    if (!resp)
        return res.status(400).json({ "error": "INVALID_ID_FOOD" });
    else {
        let food = await Food.findById(req.body.food);
        food.rating = (food.rating * food.numRating + req.body.rating) / (food.numRating + 1);
        food.numRating = food.numRating + 1;
        await food.save();
        res.json(food);
    }
})

router.get('/vendorMenu', async function (req, res) {
    const token = req.headers['x-access-token']
    // console.log(req.headers)
    try {
        const decode = jwt.verify(token, 'secret123')
        const id = decode.id
        let vendorPresent = await helper(Vendor, id);
        if (!vendorPresent)
            return res.status(400).json({ "error": "INVALID_ID_VENDOR" });
        let food = await Food.find();
        var ans = []
        food.map(item => {
            if (item.vendor == id)
                ans.push(item)
        })
        console.log(ans)
        res.json(ans);
    }
    catch (err) {
        res.send({ status: "error", error: "AUTHENTICATION_FAILED" })

    }
})

router.post('/update', async function (req, res) {
    // if (!req.body.food || !req.body.rating) {
    //     return res.status(400).json({ "error": "NOT_ALL_FIELDS_PRESENT" });
    // }
    console.log(req.body)
    const resp = await helper(Food, req.body.id);
    console.log(resp)
    if (!resp)
        return res.status(400).json({ "error": "INVALID_ID_FOOD" });
    else {
        let food = await Food.findOne({ _id: req.body.id });
        food.name = req.body.name
        food.price = req.body.price
        food.veg = req.body.veg
        food.tags = req.body.tags
        food.addons = req.body.addons
        food = await food.save(function (err, food) {
            if (err) {
                console.log(err)
                return res.status(400).json(err);
            } else {
                return res.status(200).json(food);
            }
        })
        // return res.json(food);
    }
})


module.exports = router;
