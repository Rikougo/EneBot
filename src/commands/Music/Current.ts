import { PermissionString, Message, MessageEmbed } from "discord.js";
import { Command } from "../../classes/Command";
import { Ene } from "../../ene";
import { fromUnixTime } from "date-fns"

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

            let timestamp = client.audioManagers.get(guild.id)!.dispatcher!.streamTime;
            let videoTime = video.minutes * 60000 + video.seconds * 1000;

            // --- STREAM LINE --- //

            let cursor = Math.ceil((timestamp / videoTime) * 100);

            if (cursor % 2 !== 0) cursor += 1;

            let streamLine = ""

            for(let i = 0; i < 100; i += 2) {
                streamLine += (i !== cursor ? "-" : "#");
            }

            // ------------ //

            let streamTime = Math.floor(timestamp / 60000).toString().padStart(2, "0") + ":" + Math.floor((timestamp % 60000) / 1000).toString().padStart(2, "0");

            const embed = new MessageEmbed()
                .setAuthor("Now playing")
                .setTitle("Playing " + video.title)
                .setURL(video.url)
                .setColor("#fb40ff")
                .setThumbnail(video.thumbnails!.medium!.url!)
                .setDescription("Duration : `" + video.minutes.toString().padStart(2, "0") + ":"+ video.seconds.toString().padStart(2, "0") + "`")
                .addField("Views", `\`${video.views}\``, true)
                .addField("Likes", `\`${video.likes}\``, true)
                .addField("Stream line :", `${streamLine} (${streamTime})`, false)
                .setFooter("Freydish", client.user!.avatarURL()!);

            await message.channel.send(embed);
        } else {
            await message.channel.send("No track currently playing.");
        }
    }

}