const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
	static async getStatus(request, response) {
		const redisStatus = await redisClient.isAlive();
		const dbStatus = await dbClient.isAlive();

	const status = {
		redis: redisStatus,
		db: dbStatus,
	};
	
	response.status(200).json(status);
	}

	static async getStats(request, response) {
		try {
			const usersCount = await dbClient.nbUsers();
			const filesCount = await dbClient.nbFiles();

			const stats = {
				users: usersCount,
				files: filesCount,
			};

		response.status(200).json(stats);
		} catch (error) {
			console.error(error);
			response.status(500).json({ error: 'Internal Server Error' });
		}
	}
}

module.exports = AppController;
