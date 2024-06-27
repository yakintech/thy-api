const express = require('express');
const app = express();
const cors = require('cors');
var jwt = require('jsonwebtoken');
const { productsData } = require('./data/productsData');
const { suppliers } = require('./data/suppliersData');

const jwtKey = 'my_secret_key'

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());



// Middleware to verify the token - Bearer token

app.use((req, res, next) => {

    if (req.path == "/token") {
        return next();
    }

    try {
        const token = req.headers["authorization"].split(' ')[1];
        if (!token) {
            return res.status(401).send("Access Denied");
        }
        try {
            const user = jwt.verify(token, jwtKey);
            req.user = user;
            return next();
        } catch (error) {
            return res.status(400).send("Invalid token");
        }
    } catch (error) {
        return res.status(401).send("Access Denied");
    }


});


app.get("/check", (req, res) => {
    res.json({ message: "OK" })
})


app.post("/token", (req, res) => {

    const { email, password } = req.body;

    if (email == "admin@mail.com" && password == "123") {
        const token = jwt.sign({ email }, jwtKey, { expiresIn: '1h' });
        res.json({ token });
    }
    else {
        res.status(401).send("Invalid email or password");
    }
})


app.get("/api/suppliers", (req, res) => {
    res.json(suppliers);
})

app.get("/api/products", (req, res) => {
    res.json(productsData);
})

app.get("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const product = productsData.find(p => p.id == id);
    if (product) {
        res.json(product);
    }
    else {
        res.status(404).send("Product not found");
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});