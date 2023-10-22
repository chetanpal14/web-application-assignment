const express = require('express');
const cors = require('cors');
const { connectToMongoDB } = require('./db');

const productController = require('./controller');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToMongoDB();

app.get('/', (req, res, next) => {
  res.json({
    message: 'Welcome to DressStore application.'
  })
});

app.get('/api/products', productController.getAllProducts);
app.get('/api/products/:id', productController.getProductById);
app.post('/api/products', productController.addProduct);
app.put('/api/products/:id', productController.updateProduct);
app.delete('/api/products/:id', productController.deleteProduct);
app.delete('/api/products', productController.deleteAllProducts);

app.listen(PORT, () => {
  console.log(`Server is running: http://localhost:${PORT}/`);
});
