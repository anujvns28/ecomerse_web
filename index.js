const express = require("express")
const app = express()

const {dbConnect} = require("./config/database");
const userRoutes = require("./routes/user");
require("dotenv").config();

const PORT = process.env.PORT || 4000
//middle ware
dbConnect();
app.use(express.json());

//mounging
app.use("/api/v1/user",userRoutes);
app.listen(PORT , () =>{
    console.log("server started successfully")
})


