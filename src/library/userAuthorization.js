const { response } = require('express');
const joi = require('joi');
const { verifyToken, validateRequest } = require('./functions');

// This all the open access api's. Which can be accessed without user authentication and authorization
let open_access_apis = [
    '/api/user/register', '/api/user/login', '/api/user/verifyotp', '/api/product/search'
];

// Validate user request 
const validateUser = (req, res, next) => {
    if (open_access_apis.indexOf(req.url) > -1) {
        next();
        return true;
    }

    let schema = joi.object({
        id: joi.number().integer().required(),
        accesstoken: joi.string().required(),
    });

    if (!validateRequest(req.headers, res, next, schema)) {
        return false;
    }
}

// Authorize user with the valid ID and ACCESSTOKEN
const checkAccess = (req, res, next) => {
    if (open_access_apis.indexOf(req.url) > -1) {
        next();
        return true;
    }

    if (verifyToken(req.headers.id, req.headers.accesstoken)) {
        next();
        return true;
    }
    else {
        return res.status(404).send({ error: true, message: 'ACCESS_DENIED_PLEASE_RELOGIN' });
    }
}

module.exports = { validateUser, checkAccess };