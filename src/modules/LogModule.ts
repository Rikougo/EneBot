import { Guild, GuildMember, Message, MessageEmbed, TextChannel } from "discord.js";
import { BotModule } from "../classes/BotModule";
import { Ene } from "../ene";

export class LogModule implements BotModule {
    watch: string[] = [
        "channelCreate",
        "channelDelete",
        "channelUpdate",
        "emojiCreate",
        "emojiDelete",
        "emojiUpdate",
        "guildBanAdd",
        "guildBanRemove",
        "guildMemberAdd",
        "guildMemberRemove",
        "guildMemberUpdate",
        "inviteCreate",
        "inviteDelete",
        "messageDelete",
        "messageUpdate",
        "roleCreate",
        "roleDelete",
        "roleUpdate"  
    ];

    run(client: Ene, event: string, ...args: any[]): void {
        let guild : Guild = args[0].guild;

        console.log(`${event} in ${guild.id}`)

        if (!(client.guildsConfig()[guild.id]["logChannel"])) return; // no log channel set-up for this guild

        let logChannelID = client.guildsConfig()[guild.id]["logChannel"];
        let logChannel = guild.channels.cache.get(logChannelID);

        let embed : MessageEmbed = new MessageEmbed();

        if (!logChannel) return;

        if (
            event === "channelCreate" ||
            event === "channelDelete" ||
            event === "channelUpdate"
        ) {
            return;
        } else if ( 
            event === "emojiCreate" ||
            event === "emojiDelete" ||
            event === "emojiUpdate"
        ) {
            return;
        } else if (
            event === "guildBanAdd" ||
            event === "guildBanRemove"
        ) {
            return;
        } else if (
            event === "guildMemberAdd" ||
            event === "guildMemberRemove" ||
            event === "guildMemberUpdate"
        ) {
            return;
        } else if (
            event === "inviteCreate" ||
            event === "inviteDelete"
        ) {
            return;
        } else if (event === "messageDelete")
        {
            embed = this._messageUpdate(args[0], args[1]);
        } else if (event === "messageDelete") {
            embed = this._messageDelete(args[0]);
        } else if (
            event === "roleCreate" ||
            event === "roleUpdate" ||
            event === "roleDelete"
        ){
            return;
        }
            
        (logChannel as TextChannel).send(embed);
    }

    private _authorBaseEmbed(author: GuildMember) {
        return new MessageEmbed()
            .setColor(author!.displayHexColor || "#FFFFFF")
            .setFooter(author!.displayName, author!.user!.displayAvatarURL());
    }

    private _messageUpdate(oldMessage: Message, newMessage: Message) : MessageEmbed{
        let embed = this._authorBaseEmbed(oldMessage.member!)
            .setTitle("Updated message")
            .addField("Old message", oldMessage.content)
            .addField("New Message", newMessage.content);

        return embed;
    }

    private _messageDelete(message: Message) : MessageEmbed {
        let embed = this._authorBaseEmbed(message.member!)
            .setTitle("Deleted message")
            .addField("Message", message.content)
            
        return embed;
    }


}