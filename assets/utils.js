
module.exports = {
  trim: (string, max) => {
    if (string.length <= max) return string;
    return `${string.slice(0, max - 3)}...`;
  },
  getRandomFunfact: () => {
    const funfact = require("./configs/funfact").content;
    return "WIP Internal Alpha"+ " | "+ funfact[Math.floor(Math.random() * funfact.length)]

  },
  customSplit: (str, maxLength) => {
    if (str.length <= maxLength) return [str];
    var parts = str.match(new RegExp(".{1," + maxLength + "}", "g"));
    return parts;
  },
  getMemberFromMention: (mention, GuildMemberManager) => {

    if (!mention || !GuildMemberManager) return;

    if (mention.startsWith("<@") && mention.endsWith(">")) {
      mention = mention.slice(2, -1);
      if (mention.startsWith("!")) {
        mention = mention.slice(1);
      }
    }
    try {
    return GuildMemberManager.fetch(mention).then(i => i).catch(e => null);
} catch {
    return;
}
  },
  getChannelFromMention: (mention, ChannelManager) => {

    if (!mention || !ChannelManager) return;
    if (mention.startsWith("<#") && mention.endsWith(">")) {
      mention = mention.slice(2, -1);
    }
    if(mention.startsWith("id:")) mention.slice(2);
    try {
    return ChannelManager.fetch(mention).then(i => i).catch(e => null);
    } catch {
        return;
    }
  },
  freshActivity: (client) => {
    activities = require("./configs/activities").content;
    let activity = activities[Math.floor(Math.random() * activities.length)];

    return client.user.setActivity(activity.content + ` | ${require("./configs/configs").prefix}help`, { type: activity.type }).catch(error => console.error(error));
  },
  avoidBreak: (str) => {
    if (str.constructor !== String || !str) return;
    return str.split("```").join("`‎`‎`‎");
  },
  getItem: (collection, item, type) => {
    if (!collection) return;
    var items;
    try {
       items = require(`./items/${collection}s`).content;
      
  } catch {
    return;
    }
      if(type && type.toLowerCase() === "all") return items;
      item = (item || "default").toLowerCase();
      if (item === "default") {
        let result = items.filter((value) => {
          return value.default && value.default === true;
        })
        if (!result.length) return;
        return result[Math.floor(Math.random() * result.length)];
      } else {
        let result = items.filter((value) => {
          return value.id && value.id === item || value.name && (value.name.toLowerCase().startsWith(item) || value.name.toLowerCase().endsWith(item) || value.name.split(item)[1]);
        })
        if (!result.length) return;
        return result[Math.floor(Math.random() * result.length)];
      }
  },
  getCommand: (str, client) => {
    if (!str || !client) return;
    return client.commands.cache.get(str.toLowerCase()) || client.commands.cache.find((command) => { return command.aliases && command.aliases.includes(str.toLowerCase()) });
  },
  getPage: (array, length, page) => {
    if (!array || array.constructor !== Array) return;
    if (!length || length.constructor !== Number) return;
    if (!page || page.constructor !== Number) return;
    page--;
    let l = length - 1;
    let start = 0 + (length * page);
    let end = l + (length * page);
    if (end >= array.length) {
      end = array.length - 1;
    }
    page++;
var pages_length = (array.length / length).toString().split(".");
if(pages_length[1]){
    pages_length = parseInt(pages_length[0]) + 1;
} else {
    pages_length = parseInt(pages_length[0])
}
if(pages_length <= 0) pages_length = 1;
    return { start: start, end: end, array:  array, length: length, page: page, pages: pages_length};
  },
  getUserFromMention: (mention, UserManager) => {
    if (!mention ||!UserManager) return;
    if (mention.startsWith("<@") && mention.endsWith(">")) {
      mention = mention.slice(2, -1);
      if (mention.startsWith("!")) {
        mention = mention.slice(1);
      }
    }
  
  return UserManager.fetch(mention).catch(e => null).then ;
 
  },
  errorEmbed: (error) => {
        const embed = new require("discord.js").MessageEmbed()
    .setColor(imports.colors.BG_COLOR)
    .setAuthor("Report Issue on GitHub", "https://raw.githubusercontent.com/Nefomemes/Kylebot/master/assets/GitHub-Mark-Light-120px-plus.png", "https://github.com/Nefomemes/Kylebot/issues/new")
    .setDescription("```" + imports.trim(require("util").inspect(error), 2048 - 6) + "```")
    .setFooter("Please make sure noone have ever posted a similar issue and please provide reproduction steps.", imports.client.user.displayAvatarURL({dynamic: true, format: "png"}));
    return embed;
  },
  getEmojiFromMention: (mention, EmojiManager) => {
      if(!mention || !EmojiManager) return;
      mention = mention.toString();
      
    
      
      }
}
