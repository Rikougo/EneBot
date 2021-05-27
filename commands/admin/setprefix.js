const Discord = require('discord.js');
const {writeFileSync} = require('fs');

module.exports = {
  name: 'setLog',
  /**
   *
   * @param {import("../../Ene")} client
   * @param {Discord.Message} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    if (message.author.id !== client.owner) {
      message.react('❌');
      return;
    }

    client.changePrefix(args.shift());

    message.react('✔');
  }
}