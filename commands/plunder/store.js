module.exports.run = async (imports) => {
	const user = await imports.db.getDoc('users', imports.message.author.id);
	var embed = new imports.Discord.MessageEmbed()
		.setColor(imports.colors.BG_COLOR)
		.setTitle('Store')
		.setAuthor(
			imports.client.user.username,
			imports.client.user.displayAvatarURL({ format: 'png', dynamic: true })
		)
		.setTimestamp()
		.setFooter(
			`Prefix: ${imports.prefix} | You have ${user.cp ||
				0} CP and  ${user.cash || 0} Plunder cash.`
		);

	var fields = [];
	if (
		imports.args[0] &&
		imports.getItem('bundle', imports.args[0].toLowerCase())
	) {
		imports.args.shift();
		const item = imports.getItem('bundle', imports.args[0]);

		if (imports.args[0] && imports.args[0].toLowerCase() === '--content') {
			imports.args.shift();
			for (let content of item.contents) {
				content = imports.getItem(content.type, content.id);
				if (content) {
					let rarity;
					switch (content.rarity) {
						case 1:
							rarity = 'base';
						case 2:
							rarity = 'common';
						case 3:
							rarity = 'rare';
						case 4:
							rarity = 'epic';
						case 5:
							rarity = 'legendary';
						default:
							rarity = 'unknown';
					}
					fields.push({
						name: content.name || 'Unknown',
						value: `ID: \`${content.id ||
							'<redacted>'}\`\n\nWorth ${content.price ||
							0} <:cp:744403130594230313>. \n${content.desc ||
							'<redacted>'}\nThis item have the rarity of **${rarity ||
							'unknown'}**.`,
						inline: true
					});
				}
			}
		} else {
			imports._.each(item, (value, key) => {
				if (key === 'assets') {
					value = 'Add "--content" to the back, yeah.';
				}
				fields.push({ key: key, value: value, inline: true });
			});
		}
	} else {
		const bundles = imports.getItem('bundle', null, 'all').filter(bundle => {
			if (bundle.available && bundle.available === false) return false;
			return true;
		});
		for (let bundle of bundles) {
			let user_can_buy;
			if (
				user.cp &&
				user.cp !== 0 &&
				bundle.price &&
				user.cp - bundle.price >= 0
			) {
				user_can_buy = '';
			} else {
				user_can_buy = "**Sadly, you doesn't have enough funds. :cry:**\n";
			}

			fields.push({
				name: bundle.name || 'Unknown',
				value: imports.trim(
					`ID: \`${bundle.id || '<redacted>'}\`\n\n${bundle.desc ||
						'<redacted>.'} \nThis bundle costs ${bundle.price ||
						'<redacted>'} <:cp:744403130594230313>. ${user_can_buy}`,
					1024
				),
				inline: true
			});
		}
	}
	let number = parseInt(imports.args[0]);
	if (Number.isNaN(number) || !number) {
		number = 1;
	}
	let page = imports.getPage(fields, 6, number);
	for (let field of fields) {
		let index = fields.indexOf(field);
		if (!(index > page.end || index < page.start)) {
			embed = embed.addField(field.name, field.value, field.inline);
		}
	}

	return imports.message.channel.send(embed);
};
