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
            let buyer = await  user.findById(req.body.user);
            console.log(req.body)
            const newOrder = new order({
                user: req.body.user,
                food: req.body.food,
                vendor: req.body.vendor,
                quantity: req.body.quantity,
                addOn: req.body.addOn, 
                batch: buyer.batch,
                age: buyer.age
            });
            buyer.wallet = buyer.wallet - (parseInt(req.body.price) * parseInt(req.body.quantity));
            await buyer.save();
            let f = await food.findById(req.body.food);
            f.orders = f.orders + parseInt(req.body.quantity);
            await f.save();
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

router.post('/getBuyerOrders', async function (req, res) {
    if (!req.body.user) {
        return res.status(400).json({ "error": "NOT_ALL_FIELDS_PRESENT" });
    }
    else {
        let res1 = await helper(user, req.body.user);
        if (!res1)
            return res.status(400).json({ "error": "INVALID_ID_USER" });
        else {
            order.find({ user: req.body.user }, function (err, orders) {
                if (err) {
                   return res.status(400).json(err);
                } else {
                    return res.json(orders);
                }
            })
        }
    }

})

router.post('/rate', async function (req, res) {
    console.log(req.body)
        let res1 = await helper(order, req.body.order);
        if (!res1)
            return res.status(400).json({ "error": "INVALID_ID_USER" });
        else {
            const orders = await order.findById({ _id: req.body.order })
            if(orders.rated)
                return res.status(400).json({ "error": "ALREADY_RATED" });
            orders.rating = parseInt(req.body.rate);
            orders.rated = true;
            orders.save();
            let foods = await food.findById(orders.food);
            foods.rating = (foods.rating * foods.numRating + parseInt(req.body.rate)) / (foods.numRating + 1);
            foods.numRating = foods.numRating + 1;
            foods.save();
            return res.json("success");
        }
})


router.post('/getVendorOrders', async function (req, res) {
    console.log(req.body)
    if (!req.body.vendor) {
        return res.status(400).json({ "error": "NOT_ALL_FIELDS_PRESENT" });
    }
    else {
        let res1 = await helper(vendor, req.body.vendor);
        if (!res1)
            return res.status(400).json({ "error": "INVALID_ID_USER" });
        else {
            order.find({ vendor: req.body.vendor }, function (err, orders) {
                if (err) {
                   return res.status(400).json(err);
                } else {
                    return res.json(orders);
                }
            })
        }
    }
})

router.post('/status',async function (req,res){
    console.log(req.body)
    if (!req.body.order || !req.body.status) {
        return res.status(400).json({ "error": "NOT_ALL_FIELDS_PRESENT" });
    }
    else {
        let res1 = await helper(order, req.body.order);
        if (!res1)
            return res.status(400).json({ "error": "INVALID_ID_USER" });
        else {
            const orders = await order.findById({ _id: req.body.order })
            orders.status = req.body.status;
            orders.save();
            return res.json("success");
        }
    }
})

module.exports = router;