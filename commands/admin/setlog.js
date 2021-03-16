const Discord = require("discord.js");
const { writeFileSync } = require("fs");

module.exports = {
    name: "setLog",
    /**
     * 
     * @param {import("../../Ene")} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        if (!client.guilds_info[message.guild.id]) {
            client.guilds_info[message.guild.id] = { log_id : message.channel.id };
        } else {
            client.guilds_info[message.guild.id].log_id = message.channel.id;
        }

        message.react("✔");

        writeFileSync("./cache/guilds_info.json", JSON.stringify(client.guilds_info));
    }
}