import { PermissionString, Message, TextChannel, MessageEmbed } from "discord.js";
import { Command } from "../classes/Command";
import { Ene } from "../ene";

export class BotCommand implements Command {
    perms_required: PermissionString[] = [];
    name: string = "test";
    aliases: string[] = ["t"];

    async run(client: Ene, message: Message, args: string[]): Promise<void> {
        message.react("✅");

        (message.channel as TextChannel).send("Testing command seems to work well.");

        if (args.length === 0) return;

        let embed = new MessageEmbed()
            .setTitle("Testing command")
            .setColor("#FFFFFF")
            .setFooter(client.user!.username, client.user!.avatarURL()!)

        args.forEach((v, i) => {
            embed.addField(`Argument ${i}`, v)
        });

        message.channel.send(embed);
    }

}