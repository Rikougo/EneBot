/**
 * @author Sakeiru
 */

const Discord = require("discord.js");
const { readFileSync, readdirSync } = require("fs");
const { mapInteractionOptions } = require("./util/util");

process.env.ytbToken = readFileSync("./config/ytbToken.key");

class Ene extends Discord.Client {
    constructor() {
        super();

        /**
         * @type {Map<string, function>}
         */
        this.commandManager = new Map();

        /**
         * @type {Object.<Discord.Snowflake, EneAudio>}
         */
        this.audios = {};
    }

    run() {
        this._loadCommands();

        this.login(readFileSync("./config/token.key").toString());

        let that = this;

        this.on("interactionCreate", (interaction) => {
            let args = mapInteractionOptions(interaction.options);

            let func = that.commandManager.get(interaction.commandName);

            if (!func) {
                interaction.reply("Not implemented yet or has been deleted.");
                return;
            }

            func(that, interaction, args);
        });
    }

    _loadCommands() {
        readdirSync("./commands").forEach((value) => {
            let prop = require(`./commands/${value}`);

            if (!prop.command || !prop.run) {
                console.error(`./commands/${value} file not valid.`);
                return;
            }

            this.interactionClient.createCommand(prop.command);

            this.commandManager.set(prop.command.name, prop.run);

            console.log(`Loaded ${prop.command.name} command successfuly`);
        });
    }
}

module.exports = Ene;