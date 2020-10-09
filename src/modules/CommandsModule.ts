import { Message, TextChannel } from "discord.js";
import * as fs from "fs";

import { BotModule } from "../classes/BotModule";
import { Command } from "../classes/Command";
import { Ene } from "../ene";

export class CommandsModule implements BotModule {
    watch: string[] = ["message", "messageUpdate"];

    commands: Map<string, Command>;
    aliases: Map<string, string>;

    constructor() {
        this.commands = new Map();
        this.aliases = new Map();
    }

    loadCommand(command: Command) {
        console.log(`COMMAND_MODULE::INFO - Loading ${command.name} command`);

        this.commands.set(command.name.toLocaleLowerCase(), command);

        this.aliases.set(command.name.toLocaleLowerCase(), command.name.toLocaleLowerCase());

        command.aliases.forEach(v => {
            this.aliases.set(v.toLowerCase(), command.name.toLocaleLowerCase());
        });
    }

    async run(client: Ene, event: string, ...args: any[]): Promise<void> {
        let message : Message = args[0];
        let channel : TextChannel = message.channel as TextChannel;

        if (message.editedAt !== null && Date.now() - message.editedAt!.getMilliseconds() > 500) return; 

        if (!message.content.startsWith(client.prefix()) || message.author.bot) return;

        let commandArgs = message.content.split(" ");
        let commandName = commandArgs.shift()!.replace(client.prefix(), "").toLowerCase();

        let filteredName = this.aliases.get(commandName);

        if (filteredName === undefined) return; // no command found

        let command : Command = this.commands.get(filteredName)!;

        await command.run(client, message, commandArgs);
    }

}