const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const userRoute = require('./src/routes/userRoutes.js');
const productRoute = require('./src/routes/productRoutes.js');
const { validateUser, checkAccess } = require('./src/library/userAuthorization.js');

app.use(express.json({ urlEncoded: false }));
app.use(cors());

const result = dotenv.config();
if (result.error) {
    throw result.error;
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening at PORT : ${PORT}`);
});

app.use(validateUser);
app.use(checkAccess);
app.use('/api/user', userRoute);
app.use('/api/product', productRoute);