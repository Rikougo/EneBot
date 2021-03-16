const { Message, MessageEmbed } = require('discord.js')

/**
 * 
 * @param {import('../Ene')} client 
 * @param {Message} message 
 */
module.exports = async (client, message) => {
    if (message.author.bot) { return; }

    const _message = new MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL(), message.url)
        .setColor("#000000")
        .setDescription("Message deleted")
        .setFooter(message.channel.name, message.guild.iconURL())
        .addField("message", message.content)

    client.guildLog(message.guild.id, _message);
}