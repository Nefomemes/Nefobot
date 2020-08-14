 const categories = require("../../assets/configs/commands/categories").content;

module.exports = {
    name: "help",
    run: async (imports) => {
        const form = imports.args.shift();
        var embed = new imports.Discord.MessageEmbed()
            .setColor(imports.colors.BG_COLOR)
            .setTitle(`${imports.client.user.username.split(" ")[0]} Help Command`)
            .setURL(`${imports.website}/commands`)
            .setAuthor(`${imports.client.user.username}`, imports.client.user.displayAvatarURL({ dynamic: true, format: "png" }), process.env.WEBSITE)
            .setThumbnail(imports.client.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setTimestamp()
            .setFooter(`Prefix: ${imports.prefix} | ${imports.getRandomFunfact()}`, imports.client.user.displayAvatarURL({ format: "png", dynamic: true }))
 
      var commands = imports.client.commands.cache.map(i => i);
            function getCategory(name) {
            if (!name) return;
            let modules = categories.filter(function (category) {
                return category.name.toLowerCase() === name.toLowerCase() || category.id === name;
            })
            if (!modules.length) return;
            if (modules.length > 1) return;
            return modules[0];
        }
        function filterTheCommands(category){
            category = getCategory(category.toLowerCase() || "misc").id;
            return (command) => {
                if (command.disabled && command.disabled === true) return false;
                if(category === "misc")return !command.category || command.category === "misc"; 
                return command.category && command.category === category;
            }
        }
        if(imports.getCommand(form)){
            // Command?
            let number = parseInt(imports.args[0] || 1);
            if (Number.isNaN(number) || !number){
                number = 1;
            }
            let command = imports.getCommand(form);
          
            imports._.each(command, function(value, key){
                if(key.toLowerCase().startsWith("desc"))return embed = embed.setDescription(value.toString());
                if(key === 'run')return;
                embed = embed.addField(key.toString(), value.toString(), true);
            })
        } else if(getCategory(form)){
            // Category 
            let number = parseInt(imports.args[0] || 1);
            if (Number.isNaN(number) || !number){
                number = 1;
            }
            commands = commands.filter( filterTheCommands(getCategory(form).id));
            let page = imports.getPage(commands, 25, number);
            
            commands.forEach((command) => {
                let index = commands.indexOf(command);
                if( index > page.end || index < page.start) return;
        let name = imports.client.commands.cache.findKey(i => i === command);
        embed = embed.addField(name || "Unknown", command.desc || "No description", true);
            });
        } else {
        embed = embed.setImage(imports.brandingbg);
       embed = embed.setDescription("Kylebot is currently the first Call of Duty roleplay Discord bot.")
        
            // All categories
            let number = parseInt(form);
            if (Number.isNaN(number) || !number){
                number = 1;
            }
            let page = imports.getPage(categories, 25, number);
            categories.forEach((category) => {
                let index = categories.indexOf(category);
                if( index > page.end || index < page.start) return;
                embed = embed.addField(category.name, imports.trim(`ID: \`${category.id}\` \n\n${category.desc || "No description."} \n\n${commands.filter(filterTheCommands(category.id)).length} commands available.`, 2048), true);
            })
        
        }
        imports.message.channel.send(embed);
    }
}