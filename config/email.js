const nodemailer = require("nodemailer");

async function send(to,message,subject) {
  
  let transporter = nodemailer.createTransport({
   service:'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

    // send mail with defined transport object
    await transporter.sendMail({

    from: '"Stitches & Curves" <curvesstitches@gmail.com>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: message

  }, function(err, info){

      if (err) {

          console.log(err);

      } else {

        console.log("Message sent: %s", info.messageId);  
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      }

  });

}

module.exports = send;