const Discord = require("discord.js");
const { readFileSync, writeFileSync } = require("fs");
const { isMention } = require("../../../utils/util");

function parseTime (rawTime) {
    const splitted = rawTime.split(":");

    console.log(splitted);
    
    return ((parseInt(splitted[0]) * 60 + parseInt(splitted[1])) * 60 + parseInt(splitted[2])) * 1000;
};

module.exports = {
    name: "colorCDPurge",
    /**
     * 
     * @param {import("../../../Ene")} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return;
        }

        let mention = isMention(args.shift());

        if (!mention) { 
            message.channel.send("You need to mention someone, sir.");
            return;
        }

        const member = await message.guild.members.fetch(mention);

        if (!member) {
            message.channel.send("Incorrect mention.");
            return;
        }

        if (client.colors[message.guild.id]) {
            if (client.colors[message.guild.id][member.id]) {
                client.colors[message.guild.id][member.id].cooldown = undefined;

                writeFileSync("./cache/colors.json", JSON.stringify(client.colors));

                message.react("✔");

                return;
            }
        }

        message.channel.send("Nothing to purge.");
    }
}