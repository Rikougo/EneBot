import * as discord from "discord.js";
import * as fs from "fs";
import { BotModule } from "./classes/BotModule";

import { Config } from "./classes/Config";

export class Ene extends discord.Client {
    static CONFIG_PATH : string = "./config/config.json";

    private _config : Config;

    private _modules : Map<string, BotModule[]>;

    constructor() {
        super();

        this._config = require(`.${Ene.CONFIG_PATH}`);
        
        this._modules = new Map();
    }

    prefix() : string { return this._config.prefix; }
    guildsConfig() : any { return this._config.guildsInfo; }

    addGuild(guildID: string) {
        if (this._config.guildsInfo === undefined) this._config.guildsInfo = {};

        this._config.guildsInfo[guildID] = {
            "logChannel": undefined,
        };

        this.saveConfig();
    }

    saveConfig() {
        fs.writeFileSync(Ene.CONFIG_PATH, JSON.stringify(this._config));
    }

    loadModule (module: BotModule) {
        for(let event of module.watch) {
            if (!(event in this._modules)) {
                this._modules.set(event, [module]);
            } else {
                (this._modules.get(event) || []).push(module); // weird fix for may be undefined, to fix
            }
        } 
    }

    run() {
        let that = this;

        for(let event of that._modules.keys()) {
            that.on(event, (...args: any[]) => {
                let modules = that._modules.get(event) || [];

                for(let m of modules) {
                    m.run(that, event, ...args);
                }
            });
        }

        that.login(that._config.token);
    }
}