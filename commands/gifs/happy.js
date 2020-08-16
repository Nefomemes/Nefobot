module.exports = {
    name: "happy",

    run: async (imports) => {
        var the_reason = imports.args.join(" ");
        if (the_reason) {
            the_reason = ` because "` + imports.args.join(" ") + `".`;
        } else {
            the_reason = "."
        }
        const gifs = ["https://media.discordapp.net/attachments/717210048174096446/717210623414370314/Heavy_is_Dead.gif"]
        const selectedGIF = gifs[Math.floor(Math.random() * gifs.length)];
        const embed = new imports.Discord.MessageEmbed()

            .setColor(imports.colors.BG_COLOR)
            .setAuthor(imports.client.user.username, imports.client.user.displayAvatarURL({ format: "png", dynamic: true }), imports.website)
            .setDescription(imports.trim(`${imports.message.author} is happy${the_reason}`))
            .setImage(selectedGIF)
            .setTimestamp()
            .setFooter(`Prefix: ${imports.prefix} | ${imports.getRandomFunfact()}`)
        imports.message.channel.send(embed);
    }
}