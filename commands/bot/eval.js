module.exports = {
	name: 'eval',

	run: async imports => {
		const now = Date.now();
		if (!imports.client.owners.cache.get(imports.message.author.id)) return;
		async function evall() {
			return await eval(imports.args.join(' '));
		}
		async function evaluate() {
			return await evall()
				.then(result => result)
				.catch(error => error);
		}
		evaluate().then(result => {
			const noww = Date.now();
			imports.message.channel.send(
				`Discord API latency: ${imports.client.ws.ping}ms\nBot latency: ${now -
					imports.message.createdTimestamp}ms\n Process executed within ${noww -
					now}ms. \n At the end, it takes ${noww -
					imports.message.createdTimestamp}ms to finish.`
			);
			imports.message.channel.send(
				'```js\n' +
					imports.trim(imports.avoidBreak(imports.args.join(' ')), 2000 - 12) +
					'\n```'
			);
			imports.message.channel.send(
				'```js\n' +
					imports.trim(
						imports.avoidBreak(require('util').inspect(result, { depth: 0 })),
						2000 - 12
					) +
					'\n```'
			);
		});
	}
};
