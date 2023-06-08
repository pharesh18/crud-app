const isEmailExist = "SELECT * FROM users WHERE email = $1";

const deleteUser = "DELETE FROM users WHERE email = $1 AND is_verified = $2";

const createUser = "INSERT INTO users (fname, lname, email, password, otp, is_verified, created_date) values ($1, $2, $3, $4, $5, $6, $7)";

const otpVerify = "UPDATE users SET is_verified = $1 WHERE email = $2 AND otp = $3 RETURNING *";

const loginUser = "SELECT * FROM users WHERE email = $1 AND password = $2 AND is_verified = $3";

const isCartItemExist = "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2";

const addToCartQuery = "INSERT INTO cart (user_id, product_id, created_date) VALUES ($1, $2, $3)";

module.exports = { isEmailExist, deleteUser, createUser, otpVerify, loginUser, addToCartQuery, isCartItemExist };