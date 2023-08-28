const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs")




const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {//houni badalit path avec products
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, cb) {
   // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
   // cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
    cb(null, file.originalname);
  },
});



const uploadLocally = multer({
  storage: multerStorage,
//   fileFilter: multerFilter,
  limits: { fieldSize: 2000000 },
}).array('images', 10); 







module.exports= {uploadLocally};