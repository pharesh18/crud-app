const nodemailer = require('nodemailer');
const { sign, verify } = require('jsonwebtoken');

const generateOtp = (length = 4) => {
    let otp = String(Math.ceil(Math.random() * 10000));
    return otp.length == length ? otp : generateOtp();
}

const generateToken = (id) => {
    return sign({ id }, process.env.JWTKEY);
}


const verifyToken = (id, token) => {
    let result = false;
    verify(token, process.env.JWTKEY, (err, decoded) => {
        if (err) return false;
        if (decoded.id == id)
            result = true;
    })
    return result;
}

const sendEmail = async (to, subject, text) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.OTP_MAIL, pass: process.env.OTP_PASSWORD, }
    });
    let mailOptions = { from: process.env.OTP_MAIL, to, subject, text }
    return transporter.sendMail(mailOptions);
}

const validateRequest = (reqSchema, res, next, schema) => {
    const option = {
        abortEarly: true,
        allowUnknown: true,
        stripUnknown: false
    };

    const { error, value } = schema.validate(reqSchema, option);
    if (error) {
        res.send({ error: true, message: error.message });
        return false;
    } else {
        reqSchema = value;
        next();
    }
}

module.exports = { generateOtp, sendEmail, generateToken, verifyToken, validateRequest };