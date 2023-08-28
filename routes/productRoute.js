const express= require ('express');
const multer=require ('multer');

const {createProduct,getaProduct,deleteProduct,updateProduct,addToWishlist,rating,uploadImages}=require('../controller/productController')
  const {isAdmin,authMiddleware} = require('../middlewares/authMiddleware')
  const {uploadLocally}= require("../middlewares/uploadImages")
const router = express.Router();


router.post("/",authMiddleware,isAdmin,createProduct);
router.put(
  "/upload/:id",
  authMiddleware,isAdmin, uploadLocally,uploadImages,
);

router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware,rating );




router.get("/getaProduct/:id",getaProduct)
// router.get("/getProducts",getallProducts)
router.delete("/delete/:id",authMiddleware,isAdmin,deleteProduct);
router.put("/update/:id",authMiddleware,isAdmin,updateProduct);
module.exports = router