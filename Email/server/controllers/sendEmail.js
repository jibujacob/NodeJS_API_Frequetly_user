const nodemailer = require("nodemailer");

const sendEmail = async (req,res)=>{

    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'bill.maggio34@ethereal.email',
            pass: 'gwapNdB1dzHBfy8ays'
        }
    });

    let info = await transporter.sendMail({
        from: '"JJ Test" <jibujacoblearning@gmail.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Sending mails with nodejs</b>", // html body
      });

    res.json(info)
}

module.exports = sendEmail