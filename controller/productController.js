const Product = require ('../models/Product.js');
const User= require('../models/user.js');
const asyncHandler=require('express-async-handler');
const validateMongoDbId = require("../utils/validateMongodbId");
const uploadlocally= require ("../middlewares/uploadImages.js");
const slugify = require ("slugify");


const createProduct = asyncHandler(async (req, res) => {
    try {
       if (req.body.title) {
        req.body.slug = slugify(req.body.title);
       }
      const newProduct = await Product.create(req.body);
      res.json(newProduct);
    } catch (error) {
      throw new Error(error);
    }
  });


const updateProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongoDbId(id);
  
    try {
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Le produit n'a pas été trouvé." });
      }
  
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
  
      res.json(updatedProduct);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit:", error);
      res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour du produit." });
    }
  });
  
  const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const findProduct = await Product.findById(id);
      res.json(findProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.id; // Utilisez req.params.id pour récupérer l'ID de la requête
    validateMongoDbId(id);
  
    try {
      const deletedProduct = await Product.findByIdAndDelete(id); // Utilisez findByIdAndDelete pour supprimer le produit par son ID
      if (!deletedProduct) {
        return res.status(404).json({ message: "Le produit n'a pas été trouvé." });
      }
  
      res.json(deletedProduct);
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      res.status(500).json({ message: "Une erreur est survenue lors de la suppression du produit." });
    }
  });
  
//   const getallProducts = asyncHandler(async (req, res) => {
//     try {
//         // Filtering
//         const queryObj = { ...req.query };
//         const excludedFields = ["page", "sort", "limit", "fields"];
//         excludedFields.forEach((el) => delete queryObj[el]);
        
//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        
//         let query = Product.find(JSON.parse(queryStr));

//         // Sorting
//         if (req.query.sort) {
//             const sortBy = req.query.sort.split(",").join(" ");
//             query = query.sort(sortBy);
//         } else {
//             query = query.sort('-createdAt');
//         }

//         // Limiting the fields
//         if (req.query.fields) {
//             const fields = req.query.fields.split(",").join(" ");
//             query = query.select(fields);
//         } else {
//             query = query.select('-__v');
//         }

//         // Pagination
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         query = query.skip(skip).limit(limit);

//         if (req.query.page) {
//             const productCount = await Product.countDocuments();
//             if (skip >= productCount) {
//                 throw new Error('This page does not exist');
//             }
//         }
        
//         console.log(page, limit, skip);

//         const products = await query;
//         res.json(products);
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// add to whishlist 
const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});
// rating 
const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {

    const urls = [];
    const files = req.files;

    for (const file of files) {
      
      const { path } = file;
      console.log(path);
      const uploader = (path) => uploadlocally(path);
       const newpath = uploader;
     // const newpath = await uploadLocally(path,'images'); // Utilisez directement la fonction uploadLocally ici 
      // urls.push(newpath);
      urls.push({ url: newpath.url }); 
      console.log(urls);
    }

    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
      //  images: urls.map((file) => file.url),
      images: urls,
      },
      {
        new: true,
      }
    );

    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});
 
module.exports ={
    createProduct,
    getaProduct,
    deleteProduct,
  //  getallProducts,
    updateProduct,
    addToWishlist, 
    rating ,
    uploadImages,

}