import { PermissionString, Message } from "discord.js";
import { Command } from "../../classes/Command";
import { Ene } from "../../ene";

export class BotCommand implements Command {
    perms_required: PermissionString[] = [];
    name: string = "skip";
    aliases: string[] = ["s"];

    async run(client: Ene, message: Message, args: string[]): Promise<void> {
        let guild = message.guild!;

        if (!(client.audioManagers.has(guild.id)) || !client.audioManagers.get(guild.id)!.dispatcher){
            message.channel.send("Nothing is playing right now.");
            return;
        }
        await client.audioManagers.get(guild.id)!.skip();
    }
}