module.exports = {
    desc: "Change your profie emblem.",
    docs: "https://github.com/Nefomemes/docs/blob/main/Kylebot/super-commands/selfconfigs.md#prefixselfconfigs-emblem-emblem-",
    run: async (i) => {
        if(!i.argv.emblem) return i.message.channel.send("Add the `emblem` option with the emblem you want to use.");
        if(typeof i.argv.emblem !== "string") return i.message.channel.send("The `emblem` option must be a string.");
        const name = i.argv.emblem;
        if(!name) return i.message.react("❌");
        const emblem = i.getItem("emblem", name);
        if(!emblem) return i.message.react("❌");
        const userDB = await db.collection("users").getDoc({docID: i.message.author.id});
        if(!userDB.emblems || !userDB.emblems.includes(emblem.id) || emblem.default) return i.message.channel.send("You doesn't own this emblem.");
        await i.db.collection("users").updateDoc({docID: i.message.author.id}, {$set: {"emblem": emblem.id}});
        return i.message.channel.send("Nicely done. Ez pz.");
    }
}