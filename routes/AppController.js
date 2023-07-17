const RedisClient = require('../utils/redis');
const DBClient = require('../utils/db');


const AppController = {
	getStatus: async (req, res) => {
		const redisStatus = await RedisClient.isAlive();
		const dbStatus = DBClient.isAlive();

		if (redisStatus && dbStatus) {
			res.status(200).json({ redis: true, db: true });
		} else {
			res.status(500).json({ redis: false, db: false });
		}
	},

	getStats: async (req, res) => {
		try {
			const numUsers = await DBClient.nbUsers();
			const numFiles = await DBClient.nbFiles();

			res.status(200).json({ users: numUsers, files: numFiles });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},
};

module.exports = AppController;
