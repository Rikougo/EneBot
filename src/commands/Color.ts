import { PermissionString, Message, GuildMember, Guild, Role, TextChannel } from "discord.js";
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

        // FILTER COLOR INPUT

        let filterResult = this._filterColor(args);

        if (filterResult.status === "error") channel.send(filterResult.message);

        let color = filterResult.color;

        // CHECK COLOR CHANGE CD BY GUILD

        this._checkCoolDown(colorCD, member);

        // CHECK ROLE COLOR

        let roles = await this._getOrCreateRole(guild, member, color, colorCD);

        await member.roles.add(roles.newRole!);

        await this._confirmRole(member, channel as TextChannel, color, roles);

        client.saveConfig(); // ! important to save config file
    }

    _filterColor(args: string[]) : any {
        if (args.length !== 1) {
            return {status: "error", message: "Please submit only one color."};
        }

        let color = args.shift()!.toLowerCase();

        if (!Constants.HEX_COLOR_REGEX.test(color) && !(color in Constants.CSS_HEX_COLORS)) {
            return {status: "error", message: "Please submit a hex or css color."};
        }

        color = Constants.CSS_HEX_COLORS[color] || color;

        return {status: "found", color: color};
    }

    _checkCoolDown(colorCD: any, member: GuildMember) {
        let cooldown = colorCD["colorCD"] || 3600000;

        if (!("members" in colorCD)) {
            colorCD["members"] = {};
            colorCD["members"][member.id] = Date.now();
        } else {
            if (member.id in colorCD["members"]) {
                let memberCD : any = colorCD["members"][member.id];

                if (Date.now() - memberCD < cooldown && !member.hasPermission("ADMINISTRATOR")) {
                    let remaining = format(cooldown + memberCD - Date.now(), "hh h mm m ss s");
                    return {status: "waiting", message: "`You still must wait ${remaining}`"};
                }
            }

            colorCD["members"][member.id] = Date.now();
            
        }

        return {status: "good"}
    }

    async _getOrCreateRole(guild: Guild, member: GuildMember, color: string, colorCD: any) {
        let role : Role | undefined;
        let oldRole : Role | undefined;
    
        oldRole = member.roles.cache.filter(
            (r) => {
                return r.name === "color";
            }
        ).first()!;

        await member.roles.remove(oldRole);
    
        // CHECK IF ROLE COLOR ALREADY EXIST (to avoid duplicate)
        // TODO find a way to clear unused colors role

        let colorsRoles = guild.roles.cache.filter(
            (r) => {
                return r.hexColor === color;
            }
        );

        role = colorsRoles.first();
    
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
        }
    
        return {newRole : role, oldRole: oldRole};
    }

    async _confirmRole(member: GuildMember, channel: TextChannel, color: string, roles: any) {
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
                member.roles.remove(roles.newRole!);
                member.roles.add(roles.oldRole);
                
                confirmationMessage.edit(`Cancel ${color} role selection.`);
            }
            confirmationMessage.reactions.removeAll();
        });

        confirmationCollector.on("end", () => {
            setTimeout(() => confirmationMessage.delete(), 2000);
        });

    }
}