import { Ene } from "../ene";

export interface BotModule {
    watch: string[]; // the list of events that the module is attached to

    /**
     * Run is the main body of the module, the part of code that will be run in the event is watching
     * @param client 
     * @param args variable amount/type of argument based on the event
     */
    run(client: Ene, event: string, ...args: any[]) : void;
}