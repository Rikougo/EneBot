const Discord = require("discord.js");
const { readFileSync, writeFileSync } = require("fs");

function parseTime (rawTime) {
    const splitted = rawTime.split(":");

    console.log(splitted);
    
    return ((parseInt(splitted[0]) * 60 + parseInt(splitted[1])) * 60 + parseInt(splitted[2])) * 1000;
};

module.exports = {
    name: "colorCD",
    /**
     * 
     * @param {import("../../../Ene")} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: (client, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return;
        }

        const timeRaw = args.shift();

        const timeTest = /([0-9]+):([0-5][0-9]):([0-5][0-9])/

        if (!timeTest.test(timeRaw)) {
            message.channel.send("Wrong time format ! Use `hhhh:mm:ss`");
            return;
        }

        if (!client.colors[message.guild.id]) {
            client.colors[message.guild.id] = { COOLDOWN : parseTime(timeRaw) };
        } else {
            client.colors[message.guild.id].COOLDOWN = parseTime(timeRaw);
        }

        writeFileSync("./cache/colors.json", JSON.stringify(client.colors));

        message.react("✔")
    }
}