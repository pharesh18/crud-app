const joi = require('joi');
const pool = require('../library/db.js');
const { generateOtp, sendEmail, generateToken, validateRequest } = require('../library/functions.js');

const { isEmailExist, deleteUser, createUser, otpVerify, loginUser, addToCartQuery, isCartItemExist } = require('../queries/userQuery.js');


const validateRegister = (req, res, next) => {
    const registerSchema = joi.object({
        fname: joi.string().min(2).max(20).pattern(/^[a-zA-Z ]+$/).required(),
        lname: joi.string().min(2).max(20).pattern(/^[a-zA-Z ]+$/).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(16).pattern(/^[a-zA-Z@#$%^&-=+()]+$/).required(),
    });

    if (!validateRequest(req.body, res, next, registerSchema)) {
        return false;
    }
}

const register = async (req, res) => {
    let otp = await generateOtp();

    pool.query(isEmailExist, [req.body.email], async (error, result) => {
        if (error) {
            return res.status(400).send({ error: true, message: error.message });
        }
        if (result.rowCount > 0) {
            if (result.rows[0].is_verified === false) {
                await pool.query(deleteUser, [req.body.email, false]);
            } else {
                return res.status(400).send({ error: true, message: "Email already exists" });
            }
        }

        let return_data = {
            error: false,
            message: 'success',
        }

        pool.query(createUser, [req.body.fname, req.body.lname, req.body.email, req.body.password, otp, false, new Date], async (error, result) => {
            if (error) {
                return res.status(400).send({ error: true, message: error.message });
            }
            if (result.rowCount > 0) {
                try {
                    let text = `Dear ${req.body.fname} ${req.body.lname}, Here is your OTP to register on XYZ is ${otp}`;
                    let response = await sendEmail(req.body.email, "OTP from XYZ", text);
                    console.log(response);
                    console.log(result);
                    return res.status(201).send(return_data);
                } catch (error) {
                    return_data.message = error.errors?.email ? 'duplicate_email' : 'something_broken';
                    return_data.error = true;
                    console.log('error', error);
                    return res.status(400).send(return_data);
                }
            }
        });
    });
}

const validateOtp = (req, res, next) => {
    const otpSchema = joi.object({
        email: joi.string().email().required(),
        otp: joi.number().integer().min(1000).max(9999).required(),
    });

    if (!validateRequest(req.body, res, next, otpSchema)) {
        return false;
    }
}

const verifyOtp = async (req, res) => {
    let return_data = {
        error: false,
        message: "OTP verified Successfully",
        data: {}
    };

    pool.query(otpVerify, [true, req.body.email, req.body.otp], (error, result) => {
        if (error) {
            return_data.error = true;
            return_data.message = "Something broken";
            console.log(error);
            return res.status(400).send(return_data);
        }

        if (result.rowCount > 0) {
            delete result.rows[0].password;
            result.rows[0].accesstoken = generateToken(result.rows[0].id);
            console.log(result);
            return_data.data = result.rows;
            res.status(201).send(return_data);
            console.log(return_data);
        } else {
            return_data.error = true;
            return_data.message = "Wrong OTP";
            res.status(400).send(return_data);
        }
    });
}

const validateLogin = (req, res, next) => {
    const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    });

    if (!validateRequest(req.body, res, next, loginSchema)) {
        return false;
    }
}

const login = (req, res) => {
    pool.query(loginUser, [req.body.email, req.body.password, true], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(400).send({ error: true, message: "something_broken" });
        }
        if (result.rowCount > 0) {
            delete result.rows[0].password;
            result.rows[0].accesstoken = generateToken(result.rows[0].id);
            console.log(result);
            return res.status(200).send({ error: false, message: "Login Successfully", data: result.rows });
        } else {
            console.log(result);
            return res.status(400).send({ error: true, message: "Invalid email or password" });
        }
    });
}



const validateAddToCart = (req, res, next) => {
    const cartSchema = joi.object({
        user_id: joi.number().integer().required(),
        product_id: joi.number().integer().required(),
    });

    if (!validateRequest(req.body, res, next, cartSchema)) {
        return false;
    }
}

const addToCart = (req, res) => {
    pool.query(isCartItemExist, [req.body.user_id, req.body.product_id], (error, result) => {
        if (error) {
            res.status(400).send({ error: true, message: error.message });
        }

        if (result.rowCount > 0) {
            // console.log("Already exist")
            return res.status(200).send({ error: false, message: "Added to cart" });
        } else {
            pool.query(addToCartQuery, [req.body.user_id, req.body.product_id, new Date], (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(400).send({ error: true, message: error.message });
                }
                if (result.rowCount > 0) {
                    console.log(result);
                    return res.status(200).send({ error: false, message: "Added to cart" });
                } else {
                    console.log(result);
                    return res.status(400).send({ error: true, message: "something_broken" });
                }
            });
        }
    });
}




module.exports = { validateRegister, register, validateOtp, verifyOtp, validateLogin, login, validateAddToCart, addToCart }