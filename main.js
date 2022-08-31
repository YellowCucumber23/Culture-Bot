const Discord = require("discord.js");

const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

const client = new Discord.Client();
const prefix = "-";



client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("I am online!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }
  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  if (command == "ping") {
    client.commands.get("ping").execute(message, args);

  } else if (command == "meme") {
    client.commands.get("getArticle").execute(message, args, cheerio, axios, Discord);
    
  } else if (command == "help") {
    client.commands.get("help").execute(message, args, Discord);
  }
});

client.login("ODM1MjkxMDM1NjY3MTM2NTIz.YINTZQ.08svkdJgx5UPF3raKIpCgqN26mc");
