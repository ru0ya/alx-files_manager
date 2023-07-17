const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const RedisClient = require('../utils/redis');
const DBClient = require('../utils/db');


const UsersController = {
	postNew: async (req, res) => {
		const { email, password } = req.body;
	},

	connect: async (req, res) => {
		const authHeader = req.header('Authorization');

		if(!authHeader || !authHeader.startsWith('Basic')) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const encodedCredentials = authHeader.slice('Basic'.length);
		const deccodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
		const [email, password] = decodedCredentials.split(':');

		if (!email || !password) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		try {
			const user = await DBClient.getUser({ email });

			if(!user || user.password !== crypto.createHash('sha1').update(password).digest('hex')) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			const token = uuidv4();
			const key `auth_${token}`;
			
			await RedisClient.set(key, user._id.toString(), 24 * 60 * 60);

			res.status(200).json({ token });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},
};

module.exports = UsersController;
