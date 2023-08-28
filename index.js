const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
//const dbConnect = require("./config/dbConnect");
const morgan = require('morgan')

const userRoute = require("./routes/userRoute");
const productRoute=require("./routes/productRoute");
const blogRoute=require("./routes/blogRoute");
const prodcategoryRoute= require('./routes/ProdcategoryRoute');
const blogcategoryRoute= require('./routes/blogCategory');
const brandRoute= require ('./routes/brandRoute');
const couponRoute= require ('./routes/couponRoute');
const { notFound, errorHandler } = require("./middlewares/errorHandler");



const app = express();

const dotenv = require("dotenv").config();
const cookieParser=require("cookie-parser") ;
const PORT = 5000;
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/user", userRoute);
app.use("/api/product",productRoute);
app.use("/api/blog",blogRoute);
app.use("/api/category",prodcategoryRoute);
app.use("/api/blogcategory",blogcategoryRoute);
app.use("/api/brand",brandRoute);
app.use("/api/coupon",couponRoute);
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`);
  });


