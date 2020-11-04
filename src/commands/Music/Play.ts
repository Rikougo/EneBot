import { PermissionString, Message, TextChannel } from "discord.js";
import { AudioManager } from "../../classes/AudioManager";
import { Command } from "../../classes/Command";
import { Ene } from "../../ene";

export class BotCommand implements Command {
    perms_required: PermissionString[] = [];
    name: string = "play";
    aliases: string[] = ["p"];

    async run(client: Ene, message: Message, args: string[]): Promise<void> {
        let guild = message.guild!;

        if (args.length < 1) {
            if ((client.audioManagers.has(guild.id)) && client.audioManagers.get(guild.id)!.dispatcher)
                await client.audioManagers.get(guild.id)!.pause();
            else
                await message.channel.send("Please submit a link.");
            return;
        }
    
        if (!(client.audioManagers.has(guild.id))){
            client.audioManagers.set(guild.id, new AudioManager(client, guild));
        }
    
        if (!(client.audioManagers.get(guild.id)!.dispatcher)) {
            if (message.member!.voice.channel) {
                await client.audioManagers.get(guild.id)!.connect(message.member!.voice.channel, message.channel as TextChannel);
            } else {
                await message.channel.send("You need to join a voice channel first !");
                return;
            }
        }
    
        await client.audioManagers.get(guild.id)!.play(args.join(" "));
    }

}