import { PermissionString, Message } from "discord.js";
import { Command } from "../../classes/Command";
import { Ene } from "../../ene";

export class BotCommand implements Command {
    perms_required: PermissionString[] = ["MOVE_MEMBERS"];
    name: string = "seek";
    aliases: string[] = [];

    async run(client: Ene, message: Message, args: string[]) {
        let guild = message.guild!;

        let audioManager = client.audioManagers.get(guild.id);

        if (!audioManager || audioManager!.connection && audioManager!.current === undefined){
            message.channel.send("Bot isn't in voice or not playing any track.");
            return;
        }

        let seekTime: number;

        if (args.length === 0 && /[0-9]{2}:[0-9]{2}/.test(args[0])) {
            await message.channel.send("Specify a correct timestamp to jump at (eg. `.seek 1:12` will jump at 1 minute 12 seconds`).");
            return;
        }

        let fragmentedTime : string[] = args.shift()!.split(":")!;

        seekTime = parseInt(fragmentedTime[0]) * 60 + parseInt(fragmentedTime[1]);

        if (seekTime > audioManager.current!.video.minutes * 60 + audioManager.current!.video.seconds) {
            await message.channel.send("The given timestamp is over the video duration.");
            return;
        }
    
        await audioManager!.play(audioManager.current!.video.url, true, seekTime);
    }

}