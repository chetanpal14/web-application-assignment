const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb://localhost:27017'; 
const dbName = 'Marketplace'; 
let db;

async function connectToMongoDB() {
  try {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    console.error('MongoDB has not been connected.');
  }
  return db;
}

module.exports = {
  connectToMongoDB,
  getDB,
};
