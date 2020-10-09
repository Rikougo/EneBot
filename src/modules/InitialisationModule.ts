import { Client, Message } from "discord.js";
import { BotModule } from "../classes/BotModule";
import { Ene } from "../ene";

export class InitialisationModule implements BotModule {
    watch: string[] = ["ready"];

    run(client: Ene, event: string, ...args: any[]): void {
        console.log("Bot ready");

        client.guilds.cache.forEach((v, k, m) => {
            if (!client.guildsConfig() || !(k in client.guildsConfig()))
                client.addGuild(k);
        });
    }
}