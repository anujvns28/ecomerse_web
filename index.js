const express = require("express")
const app = express()
const cors = require("cors");
const {dbConnect} = require("./config/database");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const { cloudinaryConnect } = require("./config/cloudnery");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const PORT = process.env.PORT || 4000
//middle ware
dbConnect();
app.use(express.json());

app.use(
    cors({
        origin:"*",
		credentials:true,
    },)
);

app.use(
    fileUpload({
        useTempFiles : true,
        tempFileDir : '/tmp/'
    })
)

//cloudenry connection
cloudinaryConnect();

//mounging
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/product",productRoutes);
app.listen(PORT , () =>{
    console.log("server started successfully")
})


