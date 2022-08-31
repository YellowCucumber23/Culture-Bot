module.exports = {
  name: "ping",
  desc: "ping pong!",
  execute(message, args) {
    message.channel.send("pong!");
  },
};
