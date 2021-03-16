const Discord = require("discord.js");

module.exports = {
    name: "ping",
    /**
     * 
     * @param {import("../../Ene")} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: (client, message, args) => {
        if (message.author.id === client.owner) {
            if (args.length === 0) {
                message.reply("I'm operational, sir !");
            } else {
                message.reply(`You sent :\n \`\`\`\n ${args.join("\n")}\`\`\`\n`);
            }
        } else {
            message.reply("pong");
        }
    }
}