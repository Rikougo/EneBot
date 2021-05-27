const {Message, MessageEmbed} = require('discord.js');

/**
 *
 * @param {import("../Ene")} client
 * @param {Message} oldMessage
 * @param {Message} newMessage
 */
module.exports = async (client, oldMessage, newMessage) => {
  if (oldMessage.author.bot) {
    return;
  }

  if (oldMessage.cleanContent === newMessage.cleanContent) {
    return;
  }

  const _message =
      new MessageEmbed()
          .setAuthor(
              oldMessage.author.username, oldMessage.author.avatarURL(),
              newMessage.url)
          .setColor('#000000')
          .setDescription('Message edited')
          .setFooter(oldMessage.channel.name, oldMessage.guild.iconURL())
          .addField('old', oldMessage.content || '`empty`')
          .addField('new', newMessage);

  message.attachments.forEach((v, k) => {
    if (message.attachments.size === 1) {
      _message.setImage(v.url);
    } else {
      _message.addField(`attach ${k}`, v.url);
    }
  });

  client.guildLog(oldMessage.guild.id, _message);
}