import { PermissionString, Message, MessageEmbed } from "discord.js";
import { Video } from "popyt";
import { Command } from "../../classes/Command";
import { Ene } from "../../ene";

export class BotCommand implements Command {
    perms_required: PermissionString[] = [];
    name: string = "queue";
    aliases: string[] = ["q"];
    
    async run(client: Ene, message: Message, args: string[]): Promise<void> {
        let guild = message.guild!;

        if (!(client.audioManagers.has(guild.id)) || !client.audioManagers.get(guild.id)!.dispatcher){
            message.channel.send("Nothing is playing right now.");
            return;
        }
        
        const queue : Video[] = await client.audioManagers.get(guild.id)!.queue();
        const currentVid : Video = client.audioManagers.get(guild.id)!.current!.video!;
    
        let queueText = "";   
        queue.forEach(v => queueText += `${v.title} | ${v.minutes}:${v.seconds}\n`)

        let fields = [{
            name: "__Now playing :__", 
            value: `${currentVid.title} | ${currentVid.minutes}:${currentVid.seconds}`
        }];
    
        if (queue.length > 0) fields.push({name: "__Next :__", value: queueText});
    
        const embed = new MessageEmbed()
            .setTitle("Queue for " + message.guild!.name)
            .setColor("#fb40ff")
            .setThumbnail(currentVid.thumbnails!.default!.url!)
            .setFooter("Freydish", client.user!.avatarURL()!);;
    
        for (let field of fields) {
            embed.addField(field.name, field.value);
        }
    
        message.channel.send(embed);
    }

}