const joi = require('joi');
const pool = require('../library/db.js');
const { validateRequest } = require('../library/functions.js');
const { getSingleProduct, searchItemQuery, isUserAddressAvailable, addAdressDetails, updateAddressDetails, placeOrder, getUserOrder, getOrderDetailsQuery, viewUserOrder } = require("../queries/productQuery");

const validateGetProduct = (req, res, next) => {
    const getProductSchema = joi.object({
        id: joi.number().integer().required(),
    });

    if (!validateRequest(req.params, res, next, getProductSchema)) {
        return false;
    }
}

const getProduct = (req, res) => {
    pool.query(getSingleProduct, [req.params.id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(400).send({ error: true, message: error.message });
        }
        if (result.rowCount > 0) {
            console.log(result);
            return res.status(200).send({ error: false, message: "success", data: result.rows });
        } else {
            console.log(result);
            return res.status(400).send({ error: true, message: "No product found" });
        }
    });
}



const validatesearchItem = (req, res, next) => {
    const searchItemSchema = joi.object({
        name: joi.string().required(),
    });

    if (!validateRequest(req.body, res, next, searchItemSchema)) {
        return false;
    }
}

const searchItem = (req, res) => {
    pool.query(searchItemQuery, [req.body.name.toLowerCase()], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(400).send({ error: true, message: error.message });
        }
        if (result.rowCount > 0) {
            console.log(result);
            return res.status(200).send({ error: false, message: "success", data: result.rows });
        } else {
            console.log(result);
            return res.status(400).send({ error: true, message: "No product found" });
        }
    });
}




const validateCheckout = (req, res, next) => {
    const checkoutSchema = joi.object({
        user_id: joi.number().integer().required(),
        street: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required(),
        postal_code: joi.string().required(),
        contact: joi.string().min(10).max(10).required()
    });

    if (!validateRequest(req.body, res, next, checkoutSchema)) {
        return false;
    }
}

const checkout = (req, res) => {
    pool.query(isUserAddressAvailable, [req.body.user_id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(400).send({ error: true, message: error.message });
        }
        if (result.rowCount > 0) {
            pool.query(updateAddressDetails, [req.body.street, req.body.city, req.body.state, req.body.postal_code, req.body.contact, req.body.user_id], (error, result) => {
                if (error) {
                    return res.status(400).send({ error: true, message: error.message });
                }
                if (result.rowCount > 0) {
                    return res.status(200).send({ error: false, message: 'success' });
                }
            });
        } else {
            pool.query(addAdressDetails, [req.body.user_id, req.body.street, req.body.city, req.body.state, req.body.postal_code, req.body.contact], (error, result) => {
                if (error) {
                    return res.status(400).send({ error: true, message: error.message });
                }
                if (result.rowCount > 0) {
                    return res.status(200).send({ error: false, message: 'success' });
                }
            });
        }
    });
}



const validateOrder = (req, res, next) => {
    const checkoutSchema = joi.object({
        user_id: joi.number().integer().required(),
        address_id: joi.number().integer().required(),
        product_details: joi.array().required(),
        payment_method: joi.string().required(),
        payment_amount: joi.number().required(),
        payment_status: joi.string().valid('pending', 'success').required(),
    });

    if (!validateRequest(req.body, res, next, checkoutSchema)) {
        return false;
    }
}

const order = (req, res) => {
    pool.query(placeOrder, [req.body.user_id, req.body.address_id, req.body.product_details, req.body.payment_method, req.body.payment_amount, req.body.payment_status, new Date], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(400).send({ error: true, message: error.message });
        }
        if (result.rowCount > 0) {
            console.log(result)
            return res.status(200).send({ error: false, message: "order placed successfully", data: result.rows });
        } else {
            console.log(result);
            return res.status(400).send({ error: true, message: 'something_broken' });
        }
    });
}



const validateViewOrder = (req, res, next) => {
    const viewOrderSchema = joi.object({
        id: joi.number().integer().required(),
    });

    if (!validateRequest(req.params, res, next, viewOrderSchema)) {
        return false;
    }
}

const viewOrder = async (req, res) => {
    pool.query(getUserOrder, [req.params.id], async (error, result) => {
        if (error) {
            return res.status(400).send({ error: true, message: error.message });
        }

        if (result.rowCount > 0) {
            let arrayData = [];

            (async () => {
                try {
                    for (let i = 0; i < result.rowCount; i++) {
                        const productIds = result.rows[i].product_details.map(product => product.product_id);
                        const response = await pool.query(viewUserOrder, [productIds, req.params.id, result.rows[i].order_id]);
                        if (response.rowCount > 0) {
                            arrayData.push(response.rows[0]);
                        } else {
                            res.status(400).send({ error: true, message: 'something_broken' });
                        }
                    }
                    res.status(200).send({ error: false, message: 'success', data: arrayData });
                } catch (error) {
                    res.status(400).send({ error: true, message: error.message });
                }
            })();
        } else {
            res.status(400).send({ error: true, message: "something_broken" });
        }
    });
}






module.exports = { validateGetProduct, getProduct, validatesearchItem, searchItem, validateCheckout, checkout, validateOrder, order, validateViewOrder, viewOrder };
