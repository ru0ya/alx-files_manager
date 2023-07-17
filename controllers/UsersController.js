const crypto = require('crypto');
const DBClient = require('../utils/db');


const UsersController = {
	postNew: async (req, res) => {
		const { email, password } = req.body;

		if (!email) {
			return res.status(400).json({ error: 'Missing email' });
		}

		if (!password) {
			return res.status(400).json({ error: 'Missing password' });
		}

		try {
			const userExists = await DBClient.getUser({ email });

			if (userExists) {
				return res.status(400).json({ error: 'Already exist' });
			}

			const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

			const newUser = {
				email,
				password: hashedPassword,
			};

			const createdUser = await DBClient.createUser(newUser);

			res.status(201).json({ email: createdUser.email, id: createdUser._id });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},
};

module.exports = UsersController;
