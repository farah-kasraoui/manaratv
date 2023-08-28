const express = require("express");
const{
    createUser, 
    loginUserCtrl,
    getallUser,
    getaUser,
    deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken ,
    resetPassword,  loginAdmin,getWishlist,saveAddress,getUserCart,emptyCart,applyCoupon,createOrder,getOrders,updateOrderStatus,
    userCart
}= require("../controller/userController");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
 router.post("/forgotpassword", forgotPasswordToken);
 router.post("/loginadmin", loginAdmin);
 router.post("/addcart",authMiddleware,userCart);
 router.post("/applyCoupon",authMiddleware,applyCoupon);
 router.post("/cashorder",authMiddleware,createOrder);
 router.put("/resetpassword/:token", resetPassword);
 router.put("/saveaddress", authMiddleware,saveAddress);
router.get("/getorders", authMiddleware,getOrders);
router.get("/refresh",handleRefreshToken);
router.get("/getallUser", getallUser);
router.get("/getwhishlist",authMiddleware, getWishlist);
router.get("/getcart",authMiddleware, getUserCart);

router.get("/logout",logout);

// meme etape de block et unblock parceque que l'admin ppeut faire ca
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/emptycart", authMiddleware,emptyCart);
router.delete("/:id", deleteaUser);


router.put("/edit-user", authMiddleware, updatedUser);
//pour le test du block /unblock du user on doit donner l'id du user el le token du admin et que l'admin peut faire ca
//choisir Authorization puis bearer token (postmen)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put( "/order/update-order/:id", authMiddleware,  isAdmin, updateOrderStatus);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.put("/password", authMiddleware,updatePassword);
module.exports = router;