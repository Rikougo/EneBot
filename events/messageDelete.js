const {Message, MessageEmbed} = require('discord.js')

/**
 *
 * @param {import('../Ene')} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  if (message.author.bot) {
    return;
  }

  const _message =
      new MessageEmbed()
          .setAuthor(
              message.author.username, message.author.avatarURL(), message.url)
          .setColor('#000000')
          .setDescription('Message deleted')
          .setFooter(message.channel.name, message.guild.iconURL())
          .addField('message', message.content || '`empty`');

  message.attachments.forEach((v, k) => {
    if (message.attachments.size === 1) {
      _message.setImage(v.url);
    } else {
      _message.addField(`attach ${k}`, v.url);
    }

    console.log(v);
  });

  client.guildLog(message.guild.id, _message);
}