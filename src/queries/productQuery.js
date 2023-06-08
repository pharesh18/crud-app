const getSingleProduct = "SELECT * FROM product WHERE pid = $1";

const searchItemQuery = "SELECT * FROM product WHERE LOWER(name) LIKE '%' || $1 || '%'";

const isUserAddressAvailable = "SELECT * FROM address WHERE user_id = $1";

const addAdressDetails = "INSERT INTO address (user_id, street, city, state, postal_code, contact) VALUES ($1, $2, $3, $4, $5, $6)";

const updateAddressDetails = "UPDATE address SET street = $1, city = $2, state = $3, postal_code = $4, contact = $5 WHERE user_id = $6";

const placeOrder = "INSERT INTO orders(user_id, address_id, product_details, payment_method, payment_amount, payment_status, created_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";

const getUserOrder = "SELECT * FROM orders WHERE user_id = $1";

const viewUserOrder = `
SELECT 
u.fname,
u.lname,
u.email,
addr.street,
addr.city,
addr.state,
addr.postal_code,
addr.contact,
ord.payment_method,
ord.payment_amount,
ord.payment_status,
ord.created_at,
ord.product_details,
(
	SELECT
	json_agg(json_build_object(
								'id', product.pid, 
								'name', product.name, 
								'description', product.description, 
								'price', product.price
							   ))
	FROM product WHERE pid = ANY($1::int[])
) AS order_details
FROM
orders ord
JOIN address addr ON addr.address_id = 1
JOIN users u ON u.id = $2::int
WHERE ord.order_id = $3::int
`;

module.exports = { getSingleProduct, searchItemQuery, isUserAddressAvailable, addAdressDetails, updateAddressDetails, placeOrder, getUserOrder, viewUserOrder };