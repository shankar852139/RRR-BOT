module.exports = function ({ models, api }) {
	const Threads = models.use('Threads');

	async function getInfo(threadID) {
		try {
			const result = await api.getThreadInfo(threadID);
			return result;
		}
		catch (error) {
			console.error('Error in getInfo:', error);
			throw new Error('Failed to get thread info');
		}
	}

	async function getAll(...data) {
		let where, attributes;
		for (const i of data) {
			if (typeof i !== 'object') throw global.getText("threads", "needObjectOrArray");
			if (Array.isArray(i)) attributes = i;
			else where = i;
		}
		try {
			const results = await Threads.findAll({ where, attributes });
			return results.map(e => e.get({ plain: true }));
		}
		catch (error) {
			console.error('Error in getAll:', error);
			throw new Error('Failed to get all threads');
		}
	}

	async function getData(threadID) {
		try {
			const data = await Threads.findOne({ where: { threadID } });
			if (data) return data.get({ plain: true });
			else return false;
		}
		catch (error) {
			console.error('Error in getData:', error);
			throw new Error('Failed to get thread data');
		}
	}

	async function setData(threadID, options = {}) {
		if (typeof options !== 'object' && !Array.isArray(options)) throw global.getText("threads", "needObject");
		try {
			const data = await Threads.findOne({ where: { threadID } });
			if (data) {
				await data.update(options);
				return true;
			} else {
				await createData(threadID, options);
				return true;
			}
		}
		catch (error) {
			console.error('Error in setData:', error);
			throw new Error('Failed to set thread data');
		}
	}

	async function delData(threadID) {
		try {
			const data = await Threads.findOne({ where: { threadID } });
			if (data) {
				await data.destroy();
				return true;
			}
			else {
				return false;
			}
		}
		catch (error) {
			console.error('Error in delData:', error);
			throw new Error('Failed to delete thread data');
		}
	}

	async function createData(threadID, defaults = {}) {
		if (typeof defaults !== 'object' && !Array.isArray(defaults)) throw global.getText("threads", "needObject");
		try {
			await Threads.findOrCreate({ where: { threadID }, defaults });
			return true;
		}
		catch (error) {
			console.error('Error in createData:', error);
			throw new Error('Failed to create thread data');
		}
	}

	return {
		getInfo,
		getAll,
		getData,
		setData,
		delData,
		createData
	};
};
