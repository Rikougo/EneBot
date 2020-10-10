import { PermissionString, Message } from "discord.js";
import { Command } from "../../classes/Command";
import { Ene } from "../../ene";

export class BotCommand implements Command {
    perms_required: PermissionString[] = [];
    name: string = "disconnect";
    aliases: string[] = ["dc"];

    async run(client: Ene, message: Message, args: string[]): Promise<void> {
        let guild = message.guild!;

        if (!(client.audioManagers.has(guild.id)) || !client.audioManagers.get(guild.id)!.connection){
            message.channel.send("Bot isn't in voice.");
            return;
        }

        client.audioManagers.get(guild.id)!.disconnect();
    }

}