const { ObjectId } = require('mongodb');
const { getDB } = require('./db');
const collectionName = 'products';

const getAllProducts = async (req, res) => {
  try {
    const db = getDB();

    const collection = db.collection(collectionName);
    const productName = req.query.name;
    const filter = productName ? { name: { $regex: productName, $options: 'i' } } : {};

    const data = await collection.find(filter).toArray();

    res.json({
      message: 'List of products',
      data
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const db = getDB();

    const collection = db.collection(collectionName);
    const productId = req.params.id;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await collection.findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product found', data: product });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addProduct = async (req, res) => {
  try {
    const db = getDB();

    let fields = ['name', 'description', 'price', 'quantity', 'category'];

    const missingFields = fields.filter(field => !(field in req.body));

    if (missingFields.length > 0) {
      const errorMessage = `Missing fields: ${missingFields.join(', ')}`;
      return res.status(400).json({ error: errorMessage });
    }

    const collection = db.collection(collectionName);

    const newProduct = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category
    };

    const result = await collection.insertOne(newProduct);

    if (result.acknowledged) {
      const updatedData = await collection.find({}).toArray();
      res.json({
        message: 'Product added.',
        data: updatedData
      });


    } else {
      res.status(500).json({ error: 'Failed to add product' });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const db = getDB();

    const collection = db.collection(collectionName);
    const productIdToUpdate = req.params.id;

    let keysToUpdate = ['name', 'description', 'price', 'quantity', 'category'];

    const updatedData = {};
    for (const key of keysToUpdate) {
      if (req.body[key] !== undefined) {
        updatedData[key] = req.body[key];
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(productIdToUpdate) },
      { $set: updatedData }
    );

    if (result.matchedCount ) {
      const updatedDocument = await collection.findOne({ _id: new ObjectId(productIdToUpdate) });
      res.json({
        message: 'Product updated.',
        data: updatedDocument
      });
    } else {
      res.status(500).json({ error: 'Failed to update product' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const db = getDB();
    const productIdToDelete = req.params.id;
    const collection = db.collection(collectionName);

    if (!ObjectId.isValid(productIdToDelete)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(productIdToDelete) });

    if (result.deletedCount === 1) {
      res.json({ message: 'Product deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteAllProducts = async (req, res) => {
  try {
    const db = getDB();

    const collection = db.collection(collectionName);
    const result = await collection.deleteMany({});

    if (result.deletedCount > 0) {
      res.json({ message: `${result.deletedCount} products deleted successfully` });
    } else {
      res.status(404).json({ error: 'No products found to delete.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  deleteAllProducts
};
