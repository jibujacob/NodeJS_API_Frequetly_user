const nodemailer = require("nodemailer");

const nodemailerConfig  = require("./nodemailerConfig")

const sendEmail = async ({to,subject,html}) => {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport(nodemailerConfig);

    return transporter.sendMail({
        from: '"JJ Learning" <jjlearning@abc.com>', // sender address
        to,subject,html,
      });
}

module.exports=sendEmail; 