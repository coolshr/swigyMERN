const mongoose = require('mongoose');

const order = require("../models/order");
const vendor = require("../models/vendor");
const user = require("../models/user");
const food = require("../models/food");
const { ChangeStream } = require('mongodb');
ObjectId = mongoose.Types.ObjectId;

function isValidObjectId(id) {

    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}


// function checkForId(schem, id) {
//     console.log(id);
//     if (!isValidObjectId(id)) {
//         console.log("alsjflasdf");
//         return false;
//     }
//     else {
//         if (schem.findById(id).then(item => { if (item != null) return true; }))
//             return true;
//         else
//             return false;
//     }
// }

module.exports = async function checkForId(schem, id) {
    console.log(id);
    var bol = false;
    if (!isValidObjectId(id)) {
        console.log("asdf");
        return false;
    }
    else {
        let item = await schem.findById(id);
        if (item == null)
            return false;
        else
            return true;
    }
}
