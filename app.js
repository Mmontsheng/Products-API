const express = require('express');
const PORT = process.env.PORT || 5000;
const bodyParse = require('body-parser');
const cors = require('cors');

const products = require('./routes/products');

const app = express();


app.listen(PORT, () => console.log(`connected on port : ${PORT}`));
// middlewares
app.use(bodyParse.json());
app.use(cors());
// routes
app.use('/products', products);


//console.log('jsdhhjghjg');