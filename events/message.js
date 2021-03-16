const Discord = require("discord.js")

/**
 * 
 * @param {import('../Ene')} client 
 * @param {Discord.Message} message 
 */
module.exports = async (client, message) => {
    if (message.author.bot) {
        return;
    }

    if (message.content.startsWith(client.prefix)) {
        const args = message.content.split(" ");
        const command = args.shift().replace(client.prefix, "").toLowerCase();

        if (client.commandManager[command]) {
            client.commandManager[command].run(client, message, args);
        }
    }
}