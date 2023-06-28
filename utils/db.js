const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(uri);
  }

  async isAlive() {
    try {
      await this.client.connect();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async nbUsers() {
    try {
      const db = this.client.db();
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
