/**
 * @author Sakeiru
 */
const Discord = require("discord.js");
const { ApplicationCommandOptionType } = require("discord.js").Constants;

/**
 * 
 * @param {import('../../Ene')} client
 * @param {Discord.Message} interaction 
 * @param {string[]} args 
 */
const purge = (client, message, args) => {
    /**
     * @type {Discord.TextChannel}
     */
    let channel = message.channel;

    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        channel.send("Ey', don't you think you're playing with somethin' you shouldn't ?");
    }

    let amount = parseInt(args.shift());

    if (isNaN(amount)) {
        channel.send("Strange kind of number you sent...");
        return;
    };

    channel.startTyping();

    channel.bulkDelete(amount + 1)
        .then(() => { 
            channel.send(`${amount} messages deleted.`).then((message) => setTimeout(() => message.delete(), 5000)); 
            channel.stopTyping();
        })
        .catch(err => { 
            channel.send(`Error during purge : \n\`\`\`\n${err}\n\`\`\``, ).then((message) => setTimeout(() => message.delete(), 5000));
            channel.stopTyping();
        });
};

module.exports = {
    name: "purge",
    run: purge
};