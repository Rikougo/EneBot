const Discord = require("discord.js");

module.exports = {
    name: "clearColors",
    /**
     * 
     * @param {import("../../../Ene")} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        if (message.member.hasPermission("ADMINISTRATOR")){

            message.guild.roles.cache.forEach(async (v) => { if (v.name === 'color') await v.delete() });

            const confirm = await message.channel.send("Are you sure you wanna clear colors, it will reset all members colors !");
            confirm.react("✔")
            confirm.react("❌");

            const collector = confirm.createReactionCollector(
                r => r.emoji.name === "✔" || r.emoji.name === "❌",
                { time : 15000}
            );

            collector.on("collect", (r) => {
                let admin = false;
                r.users.cache.forEach(v => { if (v.id === message.author.id) admin = true; });

                if (r.emoji.name === "✔" && admin) {
                    message.channel.send("Gettin' to work...");

                    // clear cooldown
                    if ( client.colors[message.guild.id] ) {
                        Object.keys(client.colors[message.guild.id]).forEach(v => client.colors[message.guild.id][v].cooldown = undefined);
                    }

                    message.react("✔");
                    collector.stop();
                } else if (admin) {
                    message.channel.send("Good choice ! Maybe ?");
                    collector.stop();
                }
            });

            collector.on("end", () => {
                confirm.delete();
            });
        } else {
            message.react("❌")
        }
    }
}