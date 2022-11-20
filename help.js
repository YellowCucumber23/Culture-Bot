module.exports = {
  name: "help",
  desc: "scrape from a meme article",
  //comment here now feature branch

  execute(message, args, Discord) {
    const listofcommands = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Commands')
    .addFields(
        { name: 'Search meme', value: 'usage: -meme [meme name]', inline: true },
        { name: 'Ping', value: 'usage -ping', inline: true },
    )
    message.channel.send(listofcommands);
  }
};
