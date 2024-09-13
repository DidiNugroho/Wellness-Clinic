const nodemailer = require('nodemailer')

const signup = async (req, res) => {

    let testAccount = await nodemailer.createTestAccount()

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "maddison53@ethereal.email",
          pass: "jn7jnAPss4f63QBp6D",
        },
      });

      let message = {
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      }

    transporter.sendMail(message).then((info) => {
        return res.status(201).json({ 
            msg: "you shoul recieve an email",
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        })
    }).catch(error => {
        return res.status(500).json({error })
    })

    // res.status(201).json("Singnup Succesfully....!")
}

const getBill = (req, res) => {
    res.status(201).json("getBill Succesfully....!")
}

module.exports = {
    signup,
    getBill
}