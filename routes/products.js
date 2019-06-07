const config = require('../config');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const uuid = require('uuid/v4');
const pool = mysql.createConnection(config);

pool.connect(function (err) {
    if (err) throw err;
    console.log("Connected  to DB!");
});

// get all products
router.get('/', (request, response) => {
    pool.query("SELECT * FROM products", (err, result, fields) => {
        if (err) throw err;
        if (result.length) response.status(200).json({
            message: "Product list",
            products: result
        });
        else response.status(404).json({ message: "No product found matching that id" });
    });

});

// get single product
router.get('/:id', (request, response) => {
    pool.query("SELECT * FROM products WHERE id=?", request.params.id, (err, result, fields) => {
        if (err) throw err;
        if (result.length) response.status(200).json({
            message: "Product list",
            products: result
        });
        else response.status(404).json({ message: "Product not found" });
    });
});

// insert  product
router.post('/', (request, response) => {
    const newProduct = {
        id: uuid(),
        name: request.body.name,
        description: request.body.description,
        sku: generateSKU(request.body.name),
        price: request.body.price

    };
    pool.query("INSERT INTO products SET ?", newProduct, (err, result, fields) => {
        if (err) throw err;
        response.status(201).json({
            message: "Product added",
            product: newProduct
        });
    });
});

// delete one product
router.delete('/:id', (request, response) => {
    pool.query('DELETE FROM products WHERE id=?', request.params.id, (err, result) => {
        if (err) throw err;
        if (result.affectedRows) response.status(200).json({
            message: "Product deleted",
            product: {
                id: request.params.id
            }
        });
        else response.status(404).json({ message: "Product not deleted" });

    });
});


// update product
router.put('/:id', (request, response) => {
    const id = request.params.id;

    pool.query('UPDATE products SET ? WHERE id = ?', [request.body, id], (error, result) => {
        if (error) throw error;
        if (result.affectedRows) response.status(200).json({
            message: "Product updated",
            product: {
                id: request.params.id
            }
        });
        else response.status(404).json({ message: "Product not updated" });

    });
});


// make a SKU number out of product name
function generateSKU(name) {
    const random = Math.floor(Math.random() * 100);
    return name.split(" ").length === 1 ? name.toLowerCase() + `_${random}` : name.split(" ").map(a => a.toLowerCase()).join('_') + `_${random}`;
}

module.exports = router;