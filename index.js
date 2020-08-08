
process.on("unhandledRejection", function (reason, promise) {
  console.error("Unhandled rejection", { reason: reason, promise: promise });
});

process.on("uncaughtException", err => {
  console.error("There was an uncaught error", err);
  process.exit(1); //mandatory (as per the Node docs)
});
const colors = require("./assets/configs/color").content;

const fs = require("fs").promises;
const Discord = require("discord.js");
/*const branding = require("./assets/configs/configs");*/
const { prefix, website, support, brandingbg } = require("./assets/configs/configs");
const commandList = require("./assets/configs/commands/cmd-list").content;
const Canvas = require("canvas");
const built_ins = require("./assets/utils/utils.js");
const figlet = require("figlet");
const _ = require('underscore');
const cooldowns = new Discord.Collection();
const badwords = require("./assets/configs/badwords").contents;
global.client = new Discord.Client({
  partials: ["REACTION", "MESSAGE"],
  ws: {
    intents: [
      "GUILDS",
      "GUILD_MESSAGES",
      "DIRECT_MESSAGES",
           "GUILD_MESSAGE_REACTIONS",
      "DIRECT_MESSAGE_REACTIONS"
    ]
  }
});
const client = global.client;
const configs = require("./assets/configs/configs")
const xml2js = require("xml2js");
const querystring = require("querystring");
const fetch = require("node-fetch");
const grau = require("node-grau");
const db = new grau(process.env.DB, 'bot');
client.commands = {cache:new Discord.Collection()};

var path = require('path');

const express = require("express");
const app = express();
const http = require("http");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gaz is closing in. PORT ${PORT}`);
  require("./req-handler.js").execute({ app: app })
});

client.once("ready", () => {

  console.log("Gaz is inbound!");
  built_ins.freshActivity(client);

});
client.on("ready", () => {
  setInterval(() => {
    built_ins.freshActivity(client);
  }, 150000);
})
client.on("error", (err) => {
  console.err(err);
});


(async function registerCommands(dir = "commands"){
let files = await fs.readdir(path.join(__dirname, dir));
for(let file of files){
  let stat = await fs.lstat(path.join(__dirname, dir, file));
  if(stat.isDirectory()) registerCommands(path.join(dir, file));
  else if(file.endsWith(".js")){
      let commandCode = require(path.join(__dirname, dir, file));
      let commandName = file.substring(0, file.indexOf(".js"));
      let commandModule = commandList.filter(function (command) {
        return command.name && command.name.toLowerCase() === commandName.toLowerCase() || command.aliases && command.aliases.filter((alias) => {
            return alias.toLowerCase() === commandName.toLowerCase();
                    }).length
      })[0];
     
      if(commandCode.run && commandModule){
        let command = {
          ...commandCode,
          ...commandModule,
          name: commandName
        } 
        client.commands.cache.set(commandName, command);
      }
  }
}
})()
/* const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (let file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
} */

var imports = {
  db: db,
  ...built_ins,
  ...configs,
  client: client,
  Discord: Discord,
  figlet: figlet,
  _: _,
  querystring: querystring,
  fetch: fetch,
  colors: colors,
  opt: {},
  cooldowns: cooldowns
}

async function handleMessage(message) {
/*  return new Promise((resolve, reject) => {
    try {
      (async function () {*/
              imports.message = message;
        if ( (!imports.message.author || imports.message.author.bot)) return;
  
      require("./filter").run(imports).catch(console.error);
        if (!imports.message.content.startsWith(imports.prefix)) return;
        imports.args = imports.message.content.slice(imports.prefix.length).split(/ +/);
        imports.commandName = imports.args.shift().toLowerCase();
        if (!imports.commandName) return;
        imports.command = imports.getCommand(imports.commandName);


        if ( !imports.command || imports.command.disabled && imports.command.disabled === true) return;
        if(imports.command.dev && imports.command.dev === true && !(imports.admins.includes(imports.message.author.id) || imports.admins === imports.message.author.id))return;
        if (!imports.message.guild && (imports.command.av && (imports.command.av === "guild") || imports.commandModule.wbh || imports.command.perms || imports.command.bot_perms)) return imports.message.channel.send("That command is only available in servers!");

        if (imports.message.guild) {
          if(imports.command.av && imports.command.av === "dm")return imports.message.channel.send("This command is only available in DM! Perhaps due to privacy reasons?");
          if ( imports.command.perms) {
            let permits = imports.command.perms.filter((perm) => { return !imports.message.member.hasPermission(perm) });
            if (permits.length) return imports.message.channel.send(imports.trim("You needs to have these permissions before proceeding: " + permits.join(", "), 2000));
          }

          if ( imports.command.bot_perms) {
            let permits = imports.command.bot_permissions.filter((perm) => { return !imports.message.guild.me.hasPermission(perm) });
            if ( permits.length) return imports.message.channel.send(imports.trim("The bot need these permissions before proceeding: " + permits.join(", "), 2000));
          }
          if ( imports.command.wbh && imports.message.channel.fetchWebhooks().then(wbh => wbh.length) > 10 - imports.command.wbh) return imports.message.channel.send(`This channel have reached it's maximum amount of webhooks possible. Please clear them up before proceeding.`);
        }
        if ( !imports.cooldowns.has(imports.command.name)) {
      imports.cooldowns.set(imports.command.name, new Discord.Collection());
        }
        imports.now = imports.message.createdTimestamp;
        imports.timestamps = imports.cooldowns.get(imports.command.name);
        imports.cooldownAmount = (imports.command.cooldown || 5) * 1000;
        imports.expirationTime = imports.timestamps.get(imports.message.author.id) + imports.cooldownAmount;
        imports.timeLeft = (imports.expirationTime - imports.now) / 60000;
      
        if (imports.timestamps.has(imports.message.author.id) && imports.now < imports.expirationTime) {
         if(imports.options && imports.opt.bypassSlowmode && imports.opt.bypassSlowmode === true && imports.message.author.id === ""){

         }else {
           return;
         }
         
        }
      
        imports.timestamps.set(imports.message.author.id, imports.now);
        setTimeout(() => {
          if (imports.timestamps.has(imports.message.author.id)) {
            imports.timestamps.delete(imports.message.author.id);
          } else {
            
          }
         }, imports.cooldownAmount);
      

        imports.command.run(imports).catch(e => {
          imports.message.channel.send("```"+imports.trim(require("util").inspect(e), 2000 - 6) + "```");
        })
/*
      })()
    } catch (e) {
      reject(e)
    }
  })*/
}
/*
function handleMessage(message) {
  if (!message.author) return;
  if (message.author.bot) return;

  require("./filter.js").run({db: db, message: message, Discord: Discord, client: client, ...built_ins, colors: colors })
  if (!message.content.startsWith(prefix)) return;


  var args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  if (!commandName) return;

  var commandModule = built_ins.getCommand(commandName, { type: "module" });
  if (!commandModule) return;
  if (commandModule.disabled && commandModule.disabled === true) return message.react("❌");
   if (message.guild) {
    if (message.guild.id !== "712195322230865994" && commandModule.category && commandModule.category.toLowerCase() === "nefomemes' coding bunker exclusive") return message.channel.send("Oops, that command is only available at Nefomemes' Coding Bunker. Use `mw!codingbunker` for more information.")
    if (commandModule.permissions) {

      const permits = commandModule.permissions.filter(function (value, index, arr) { return !message.member.hasPermission(value) });

      if (permits.length) return message.react("❌")

    }
    if (commandModule.bot_permissions) {

      const permits = commandModule.bot_permissions.filter(function (value, index, arr) { return !message.guild.me.hasPermission(value) });

      if (permits.length) return message.react("❌");

    }

    if (!message.channel.permissionsFor(client.user.id).has("SEND_MESSAGES") || !message.channel.permissionsFor(client.user.id).has("EMBED_LINKS") || !message.channel.permissionsFor(client.user.id).has("ATTACH_FILES")) returnmessage.react("❌")

    if (commandModule.webhooks && message.guild.fetchWebhooks().then(map => map.length) > 10 - commandModule[0].webhooks) return message.react("❌")

  }

  if (!message.guild && commandModule.guild && commandModule.guild === true || !message.guild && commandModule.permissions && commandModule.permissions || !message.guild && commandModule.bot_permissions && commandModule.bot_permissions || !message.guild && commandModule.webhooks) return message.react("❌")

  const command = built_ins.getCommand(commandModule.name, { type: "command", client: client });

  if (!command) return message.react("❌")



  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 5) * 1000;
  const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
  const timeLeft = (expirationTime - now) / 60000;

  if (timestamps.has(message.author.id) && now < expirationTime) {
    if (
      message.author.id === "665419057075585025" && message.content.toLowerCase().endsWith(" --debug")
    ) {
      args.pop();
    } else {
      return message.react("❌")
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => {
    if (timestamps.has(message.author.id)) {
      timestamps.delete(message.author.id);
    }}, cooldownAmount);

  var imports = {
    db: db,
    ...built_ins,
    message: message,
    args: args,
    client: client,
    Discord: Discord,
    website: website,
    support: support,
    brandingbg: brandingbg,
    prefix: prefix,
    timestamps: timestamps,
  
    figlet: figlet,
 
    _: _,
 
    querystring: querystring,
    fetch: fetch,
    colors: colors,

  }

  try {
    if (!command.run) return imports.message.react("❌")
    command.run(imports).catch(err => {
      message.channel.send(`An error occured! ${err}`);
      console.error(err);
    });
  } catch (error) {

    message.channel.send(`An error occurred! ${error}`);
  } } */
  
  function cmdHandler(message){
    return handleMessage(message).catch(e => {
      message.channel.send("```" + built_ins.trim(require("util").inspect(e), 2000 - 6) + "```")
    });
  }
client.on("message", cmdHandler);
client.on("messageUpdate", (oldMessage, newMessage) => {
  cmdHandler(newMessage);
});

client.login();
