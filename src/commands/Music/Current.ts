import { PermissionString, Message, MessageEmbed } from "discord.js";
import { Command } from "../../classes/Command";
import { Ene } from "../../ene";

export class BotCommand implements Command {
    perms_required: PermissionString[] = [];
    name: string = "current";
    aliases: string[] = ["c"];

    async run(client: Ene, message: Message, args: string[]): Promise<void> {
        let guild = message.guild!;

        if (!(client.audioManagers.has(guild.id)) || !(client.audioManagers.get(guild.id)!.dispatcher)){
            await message.channel.send("Nothing is playing right now.");
            return;
        }

        if (!(client.audioManagers.get(guild.id)!.current === undefined)){
            let video = client.audioManagers.get(guild.id)!.current!;

            const embed = new MessageEmbed()
                .setAuthor("Now playing")
                .setTitle("Playing " + video.title)
                .setURL(video.url)
                .setColor("#fb40ff")
                .setThumbnail(video.thumbnails!.medium!.url!)
                .setDescription(`Duration : \`${video.minutes}:${video.seconds}\``)
                .setFooter("Freydish", client.user!.avatarURL()!);

            await message.channel.send(embed);
        } else {
            await message.channel.send("No track currently playing.");
        }
    }

}