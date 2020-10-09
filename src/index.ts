import * as fs from "fs";

import { Ene } from "./ene";
import { CommandsModule } from "./modules/CommandsModule";
import { InitialisationModule } from "./modules/InitialisationModule";
import { LogModule } from "./modules/LogModule";

const ene = new Ene();

function init(ene: Ene) {
    function fetchCommandDir(commandsModule: CommandsModule, path: string) {
        fs.readdir(path, {}, (err, files) => {
            if (err) throw err;
        
            files.forEach(function(value: any, index: any, array: any) {
                if (value.includes(".")) {
                    let module_name = value.split(".")[0];

                    let modulePath = `${path}/${module_name}`.replace("/bin", "");
                    import(modulePath).then(x => {
                        commandsModule.loadCommand(new x.BotCommand!());
                    });
                } else {
                    fetchCommandDir(commandsModule, `${path}/${value}`);
                }
            });
        });
    }

    let initModule = new InitialisationModule();
    let logModule = new LogModule();
    let commandsModule = new CommandsModule();

    fetchCommandDir(commandsModule, "./bin/commands");

    ene.loadModule(initModule);
    // ene.loadModule(logModule);
    ene.loadModule(commandsModule);

}

init(ene);

ene.run();