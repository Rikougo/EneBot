import { PermissionString, Message, GuildMember, Guild, Role } from "discord.js";
import { format } from "date-fns";

import { Command } from "../classes/Command";
import { Constants } from "../classes/Constants";
import { Ene } from "../ene";

export class BotCommand implements Command {
    perms_required: PermissionString[] = [];
    name: string = "color";
    aliases: string[] = ["c"];

    async run(client: Ene, message: Message, args: string[]): Promise<void> {
    
        const member = message.member!;
        const channel = message.channel!;
        const guild = message.guild!;
        const config = client.guildsConfig();

        if (!("colors" in config[guild.id])) config[guild.id]["colors"] = {};

        const colorCD = config[guild.id]["colors"];

        const DEFAULT_CD = "colorCD" in colorCD ? colorCD["colorCD"] || 3600000 : 3600000;

        // FILTER COLOR INPUT

        if (args.length !== 1) {
            channel.send("Please submit only one color.");
            return;
        }

        let color = args.shift()!.toLowerCase();

        if (!Constants.HEX_COLOR_REGEX.test(color) && !(color in Constants.CSS_HEX_COLORS)) {
            channel.send("Please submit a hex or css color.");
            return;
        }

        color = color in Constants.CSS_HEX_COLORS ? Constants.CSS_HEX_COLORS[color] : color;

        // CHECK COLOR CHANGE CD BY GUILD

        if (!("members" in colorCD)) {
            colorCD["members"] = {};
            colorCD["members"][member.id] = Date.now();
        } else {
            if (member.id in colorCD["members"]) {
                let memberCD : any = colorCD["members"][member.id];

                if (Date.now() - memberCD < DEFAULT_CD && !member.hasPermission("ADMINISTRATOR")) {
                    let remaining = format(DEFAULT_CD + memberCD - Date.now(), "hh mm ss");
                    await channel.send(`You still must wait ${remaining}`);

                    return;
                }
            }

            colorCD["members"][member.id] = Date.now();
        }

        // CHECK ROLE COLOR

        let roles = await this._getOrCreateRole(guild, member, color, colorCD);

        await member.roles.add(roles.newRole!);

        let confirmationMessage = await channel.send("Done, confirm color ?");
        
        await confirmationMessage.react("✔");
        await confirmationMessage.react("❌");

        const confirmationCollector = confirmationMessage.createReactionCollector(
            (r, u) => u.id == member.id && (r.emoji.name == "✔" || r.emoji.name == "❌"),
            {time: 5000} 
        );

        confirmationCollector.on("collect", r => {
            if (r.emoji.name == "✔")
                confirmationMessage.edit(`Role ${color} successfully given.`);
            else {
                message.member!.roles.remove(roles.newRole!);
                if (roles.oldRole) message.member!.roles.add(roles.oldRole);
                
                confirmationMessage.edit(`Cancel ${color} role selection.`);
            }
            confirmationMessage.reactions.removeAll();
        });

        confirmationCollector.on("end", () => {
            setTimeout(() => confirmationMessage.delete(), 1000);
        });

        client.saveConfig(); // ! important to save config file
    }

    async _getOrCreateRole(guild: Guild, member: GuildMember, color: string, colorCD: any) {
        let role : Role | undefined;
        let oldRole : Role | undefined;
    
        for (let role of member.roles.cache) {
            if (role[1].name === "color"){
                oldRole = role[1];
                await member.roles.remove(role);
            }
        }
    
        // CHECK IF ROLE COLOR ALREADY EXIST (to avoid duplicate)
        // TODO find a way to clear unused colors role
    
        if (!("roles" in colorCD)) // remember to add it in map
            colorCD["roles"] = {}
    
        if (guild.id in colorCD["roles"]) {
            if (color in colorCD["roles"]) {
                let roleID = colorCD["roles"][color];
                role =  (await guild.roles.fetch(roleID))!;
            }
        } else {
            colorCD["roles"] = {};
        }
    
        // if role not found create one
        if (!role) {
            try {
                role = await guild.roles.create({
                    data : {
                        name: "color",
                        color: color,
                    },
                    reason : "created by automatic color attribuation."
                });
            } catch (e) {
                console.error(e);
            }
    
            colorCD["roles"][color] = role!.id;
        }
    
        return {newRole : role, oldRole: oldRole};
    }
}