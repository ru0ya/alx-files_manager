const { MongoClient } = require('mongodb');

const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.DB_PORT || 27017;
const DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${HOST}:${PORT}`;

class DBClient {
  constructor() {
    MongoClient.connect(url, (err, client) => {
      if (!err) {
        this.db = client.db(`${DATABASE}`);
      } else {
        this.db = false;
      }
    });
  }

  isAlive() {
    if (this.db) return true;
    return false;
  }

  async nbUsers() {
    try {
      const db = this.db();
      const collection = db.collection('users');
      const count = await collection.countDocuments();
      return count;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async nbFiles() {
    try {
      const db = this.client.db();
      const collection = db.collection('files');
      const count = await collection.countDocuments();
      return count;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
