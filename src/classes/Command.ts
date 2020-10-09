import { Message, PermissionString } from "discord.js";
import { Interface } from "readline";
import { Ene } from "../ene";

export interface Command {
    perms_required: PermissionString[];
    name: string;
    aliases: string[];

    run(client: Ene, message: Message, args: string[]) : Promise<void>;
}