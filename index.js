const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

// .env file configuration
const result = dotenv.config();
if (result.error) {
    throw result.error;
}

const userRoute = require('./src/routes/userRoutes.js');
const productRoute = require('./src/routes/productRoutes.js');
const { validateUser, checkAccess } = require('./src/library/userAuthorization.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors());


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening at PORT : ${PORT}`);
});

app.use(validateUser);     // validate request
app.use(checkAccess);      // verify user
app.use('/api/user', userRoute);
app.use('/api/product', productRoute);