const cloudinary = require ('cloudinary')

cloudinary.config({ 
  cloud_name: 'dvwzkhhn3', 
  api_key: '963558466352911', 
  api_secret: 'm_4P2ZGps0jERubzJkOS1SAm86k' 
})

const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUploads,(result)=> {
      resolve(
        {
          url: result.secure_url,
          // asset_id: result.asset_id,
          // public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};
// const cloudinaryUploadImg = async (fileToUploads) => {
//     return new Promise((resolve, reject) => {
//       cloudinary.uploader.upload(fileToUploads, {
//         resource_type: "auto", // Cela peut également être passé comme option dans la méthode upload
//       }, (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve({
//             url: result.secure_url,
//             asset_id: result.asset_id,
//             public_id: result.public_id,
//           });
//         }
//       });
//     });
//   };
const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(fileToDelete, (result) => {
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

module.exports = cloudinaryUploadImg;
