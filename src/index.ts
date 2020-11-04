import * as fs from "fs";

import { Ene } from "./ene";
import { CommandsModule } from "./modules/CommandsModule";
import { InitialisationModule } from "./modules/InitialisationModule";
import { LogModule } from "./modules/LogModule";

const ene = new Ene();

function init(ene: Ene) {
    let initModule = new InitialisationModule();
    let logModule = new LogModule();
    let commandsModule = new CommandsModule();

    commandsModule.loadCommandDir("./bin/commands");

    ene.loadModule(initModule);
    // ene.loadModule(logModule);
    ene.loadModule(commandsModule);

}

init(ene);

ene.run();