const express = require('express');
const app = express();
const rand = require('./routes/food');
// const cors = require('cors');
const mongoose = require('mongoose');
const cors = require('cors');
app.use(express.json());
app.use(cors());

app.use("/order", require("./routes/order"));
app.use("/vendor", require("./routes/vendor"));
app.use("/food", require("./routes/food"));
app.use("/user", require("./routes/user"));
app.use("/login", require("./routes/login"));


mongoose
    .connect("mongodb://localhost:27690/order", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("Mongodb connected") })
    .catch(err => console.log(err));

const port = process.env.PORT || 5000;



app.listen(port, () => console.log(`Server started on port ${port}`)); 