const redis = require('redis');

class RedisClient {
  constructor(port, host) {
    this.client = redis.createClient(port, host);
    this.client.on('error', (err) => {
      console.error(err);
    });
  }

  isAlive() {
    return new Promise((resolve) => {
      this.client.on('connect', () => {
        resolve(true);
      });

      this.client.on('error', () => {
        resolve(false);
      });
    });
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, duration, (error, reply) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        resolve(reply);
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error, res) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(res);
      });
    });
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
