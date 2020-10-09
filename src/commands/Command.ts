import { PermissionString, Message, MessageEmbed } from "discord.js";
import { Command } from "../classes/Command";
import { Ene } from "../ene";

export class BotCommand implements Command{
    perms_required: PermissionString[] = [];
    name: string = "command";
    aliases: string[] = ["c"];

    run(client: Ene, message: Message, args: string[]): Promise<void> {
        if(args[0] == "help"){
                message.reply("Add args !");
                return;
            }
            
        const array = args.join(" ");
        const arraySplit = array.split("/");

        const command = new MessageEmbed()
        .setTitle('<:colis:758293075767459860> Command of ' + message.author.username + ' <:colis:758293075767459860>')
        .addField(':keyboard: By: :keyboard:', `${message.author.username}`, true)
        .addField("<:phone:758295414515433472> Object: <:phone:758295414515433472>", `${arraySplit[0]}`, true)
        .addField("<:money:758295859812106321> Price: <:money:758295859812106321>", `${arraySplit[1]}`, true)
        .addField(":1234: Count: :1234:", `${arraySplit[2]}`, true)

        let channel = message!.guild.channels.cache.find(ch => ch.name === "🛒commands🛒");
        if(!channel) return message.channel.send("<:error:758298336821903367> Channel not found");

        const wait = new MessageEmbed()
                .setTitle(':book:  Information about your command: :book: ')
                .setDescription(`<:Shop2:763337954478653451> Your command that contains ${arraySplit[0]} for a price of ${arraySplit[1]} is course ...`)
                .setColor('ORANGE')
                .setFooter('🛒 Thanks for using ' + message.guild.name)
            
        message.delete().catch(O_o=>{});
        message.author.createDM().then(channel => {
            channel.send(wait)
    
        });
        channel.send(command).then((em) =>{
        em.react('758385655750983720').then(() =>{
            em.react('758298336821903367')

            //Collector:
            //Collector 1
            const filter = (reaction, user) => {
                return em.reaction.emoji.id === '758385655750983720' && user.id === message.author.id;
            };
            const collector = message.createReactionCollector(filter, { time: année})
            collector.on('collect', r => {
        
                const wait = new MessageEmbed()
                .setTitle(':book:  Information about your command: :book: ')
                .setDescription(`<:success:758385655750983720> Your command that contains ${arraySplit[0]} for a price of ${arraySplit[1]} is good !...`)
                .setColor('GREEN')
                .setFooter('🛒 Thanks for using ' + message.guild.name)
            
                message.author.createDM().then(channel => {
                channel.send(wait)
                console.log('Good emoji react')
            
                });
                
            })

            //Collector 2:
            const filter2 = (reaction, user) => {
                return em.reaction.emoji.id === '758298336821903367' && user.id === message.author.id;
            };
            const collector2 = message.createReactionCollector(filter2, { time: année})
            collector2.on('collect', r => {
        
                const nope = new MessageEmbed()
                .setTitle(':book:  Information sur votre commande: :book: ')
                .setDescription(`<:error:758298336821903367> Your command is cancelled ! `)
                .setColor('RED')
                .setFooter('🛒 Thanks for using ' + message.guild.name)
            
                message.author.createDM().then(channel => {
                channel.send(nope)
                console.log('Nope emoji react')
            
                });
                
            })

        })
    })
    }

}