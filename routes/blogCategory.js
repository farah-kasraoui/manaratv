const express = require('express');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware');
const {createCategory,updateCategory,getallCategory,getCategory,deleteCategory}=require("../controller/blogCategoryController")
const router= express.Router();

router.post('/',authMiddleware,isAdmin,createCategory);
router.put('/:id',authMiddleware,isAdmin,updateCategory);
router.get('/allcategories',getallCategory)
router.get('/:id',getCategory);
router.delete('/:id',authMiddleware,isAdmin,deleteCategory);


module.exports=router