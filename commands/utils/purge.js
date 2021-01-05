/**
 * @author Sakeiru
 */
const Discord = require("discord.js");
const { ApplicationCommandOptionType } = require("discord.js").Constants;

/**
 * 
 * @param {import('../../Ene')} client
 * @param {Object} interaction 
 * @param {Map<string, number|string|boolean>} args 
 */
const purge = (client, interaction, args) => {
    /**
     * @type {Discord.TextChannel}
     */
    let channel = interaction.channel;

    if (!interaction.member.hasPermission("MANAGE_MESSAGES")) {
        channel.send("Ey', don't you think you're playing with somethin' you shouldn't ?");
    }

    let amount = args.get("amount");

    channel.bulkDelete(amount)
        .then(() => channel.send(`${amount} messages deleted.`))
        .catch(err => channel.send(`Error during purge : \n\`\`\`\n${err}\n\`\`\``));
};

const command = {
    name: "purge",
    description: "Some devil messages above huh ?",
    options: [
        {
            type: "INTEGER",
            name: "amount",
            description: "For how long does this heresy last ?",
            required: true
        }
    ]
};

module.exports = {
    run: purge,
    command: command
};