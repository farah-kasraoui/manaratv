 const nodemailer = require ("nodemailer");
 const asyncHandler=require("express-async-handler");




const sendEmail=asyncHandler(async(data,req,res)=>{

//     const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true,
//         auth: {
//           // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//           user:"bensjihane2@gmail.com" ,//genereated ethereal user
//          pass: "sdsmjylnaevefebo"// genereated ethereal password 
//       // pass:'123456789marlboro'
//         }
//       });

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jihanebensalem023@gmail.com ',
        pass: 'csrvnuiabusmkhvk'
    },
    tls: {
        rejectUnauthorized: false // Add this line to bypass SSL certificate validation
    }
  });
 
      
      //async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Hey 👻" <abc@gmail.com.com>', // sender address
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.htm, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
       
      }
     
      
      main().catch(console.error);

})

 module.exports ={sendEmail}






