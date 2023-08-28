const Blog= require ('../models/Blog.js')
const User = require('../models/user.js')
const validateMongoDbId = require("../utils/validateMongodbId.js");
const asyncHandler= require("express-async-handler")
//create
const createBlog = asyncHandler(async (req, res) => {
    try {
      const newBlog = await Blog.create(req.body);
      res.json(newBlog);
    } catch (error) {
      throw new Error(error);
    }
  });


//update
const updateBlog = asyncHandler(async (req, res) => {
  const id = req.params.id;
  
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(updatedBlog);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Internal server error" });
  }
});


  
  // //get blog 
  // const getBlog = asyncHandler(async (req, res) => {
  //   const { id } = req.params;
  //   validateMongoDbId(id);
  //   try {
  //     const getBlog = await Blog.findById(id)
  //       .populate("likes")
  //       .populate("dislikes");
  //     const updateViews = await Blog.findByIdAndUpdate(
  //       id,
  //       {
  //         $inc: { numViews: 1 },
  //       },
  //       { new: true }
  //     );
  //     res.json(getBlog);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // });
  const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const getBlog = await Blog.findById(id)
        .populate("likes")
        .populate("dislikes");
      const updateViews = await Blog.findByIdAndUpdate(
        id,
        {
          $inc: { numViews: 1 },
        },
        { new: true }
      );
      res.json(getBlog);
    } catch (error) {
      throw new Error(error);
    }
  });

  // getAllBlogs
  const getAllBlogs = asyncHandler(async (req, res) => {
    try {
      const getBlogs = await Blog.find();
      res.json(getBlogs);
    } catch (error) {
      throw new Error(error);
    }
  });
  //deleteBlog
  const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deletedBlog = await Blog.findByIdAndDelete(id);
      res.json(deletedBlog);
    } catch (error) {
      throw new Error(error);
    }
  });
// like:
 const liketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  // Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  // find the login user
  const loginUserId = req?.user?._id;
  // find if the user has liked the blog
  const isLiked = blog?.isLiked;
  // find if the user has disliked the blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
 });





//dislike 
const disliketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  // Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  // find the login user
  const loginUserId = req?.user?._id;
  // find if the user has liked the blog
  const isDisLiked = blog?.isDisliked;
  // find if the user has disliked the blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});


  module.exports={ createBlog,updateBlog ,getBlog,getAllBlogs,deleteBlog,liketheBlog,disliketheBlog}