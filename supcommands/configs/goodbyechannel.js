

module.exports = {
desc: "Update the goodbye channel.",
docs: "https://github.com/Nefomemes/docs/blob/main/Kylebot/super-commands/configs.md#prefixconfigs-desc--description",
run:  async (i) => {
    if(i.argv.channel){
        const channel = i.getChannelFromMention(i.argv.channel, i.message.guild.channels);
        if (!channel) return i.message.channel.send("Invalid channel.");
        if(channel.type !== "text") return i.message.channel.send("The channel must be a text channel.");
        if (!channel.permissionsFor(client.user.id).has("SEND_MESSAGES") || !channel.permissionsFor(client.user.id).has("VIEW_CHANNEL")) return i.message.channel.send("Some permissions needed are missing from this channel. Try again, sir.");
        await db.collection("guilds").updateDoc({ docID: i.message.guild.id }, { $set: { goodbyeChannel: channel.id } });
    } else if(i.argv.remove_channel && i.argv.remove_channel === true){
        await db.collection("guilds").updateDoc(
            {docID: i.message.guild.id},
            {$unset: {goodbyeChannel: ""}});
    } else {
        const guildDB = await db.collection("guilds").getDoc({docID: i.message.guild.id});
        return i.message.channel.send(
            `Current goodbye channel: ${guildDB.goodbyeChannel || "none"}
            
            To change the goodbye channel. Add the \`channel\` option with a text channel.
            To get rid of it. Add the \`remove_channel\` flag like this: \`--remove_channel\`
            `);
    }
  
    return i.message.channel.send("Nicely done. Ez pz.");
}
}