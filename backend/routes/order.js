const express = require("express");
const router = express.Router();

const order = require("../models/order");
const vendor = require("../models/vendor");
const user = require("../models/user");
const food = require("../models/food");
const helper = require("../helper/helper");

router.get('/', function (req, res) {
    order.find(function (err, orders) {
        if (err) {
            console.log(err);
        } else {
            res.json(orders);
        }
    })
});

router.post('/', async function (req, res) {
    if (!req.body.user || !req.body.food || !req.body.vendor || !req.body.quantity) {
        return res.status(400).json({ "error": "NOT_ALL_FIELDS_PRESENT" });
    }
    else {
        let res1 = await helper(vendor, req.body.vendor);
        let res2 = await helper(food, req.body.food);
        let res3 = await helper(user, req.body.user);
        if (!res1)
            return res.status(400).json({ "error": "INVALID_ID_VENDOR" });
        else if (!res2)
            return res.status(400).json({ "error": "INVALID_ID_FOOD" });
        else if (!res3)
            return res.status(400).json({ "error": "INVALID_ID_USER" });
        else {
            console.log(req.body)
            const newOrder = new order({
                user: req.body.user,
                food: req.body.food,
                vendor: req.body.vendor,
                quantity: req.body.quantity,
                addOn: req.body.addOn
            });
            newOrder.save(function (err, order) {
                if (err) {
                    return res.status(400).json(err);
                } else {
                    return res.send(" Order placed successfully");
                }
            })
        }
    }

});

// router.post('/orderVendor', function (req, res) {
//     vendor.findOne({ _id: req.body.id })
//         .then(vendor => {
//             res.json(vendor)
//         })
//         .catch(err => {
//             res.status(400).send(err);
//         })
// });



module.exports = router;