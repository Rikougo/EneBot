import { PermissionString, Message, TextChannel } from "discord.js";
import { Command } from "../../classes/Command";
import { Ene } from "../../ene";


export class BotCommand implements Command {
    perms_required: PermissionString[] = ["MANAGE_MESSAGES"];
    name: string = "clean";
    aliases: string[] = [];

    async run(client: Ene, message: Message, args: string[]): Promise<void> {
        let channel : TextChannel  = (message.channel as TextChannel);

        let amount = parseInt(args[0]) || 10;

        if (isNaN(amount)) {
            channel.send("Enter a correct number.");
            return;
        }

        channel.bulkDelete(amount)
            .then(() => { 
                let promise = channel.send(`Deleted ${amount} messages successfuly.`)
                    .then(
                        message => {
                            message.react("✅");
                            setTimeout(() => message.delete(), 5000);
                        }
                    );
            })
            .catch((err) => { 
                channel.send(err.message).then( 
                    message => {
                        setTimeout(() => message.delete(), 5000);
                    }) 
            });
    }
 
}