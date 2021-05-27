/**
 * @author Sakeiru
 */

const Discord = require('discord.js');
const path = require('path');
const {
  readFileSync,
  readdirSync,
  existsSync,
  Dirent,
  writeFileSync,
  mkdirSync,
} = require('fs');
const CONFIG_PATH = './config/'

if (existsSync(CONFIG_PATH + 'ytbToken.key')) {
  process.env.ytbToken = readFileSync(CONFIG_PATH + 'ytbToken.key');
}

class Ene extends Discord.Client {
  constructor() {
    super();

    this.owner = readFileSync('./config/owner_id.key').toString().trim();

    /**
     * @type {string}
     */
    this.prefix = '5';

    /**
     * @type {Object.<string, {run: function, name: string}>}
     */
    this.commandManager = {};

    /**
     * @type {Object.<Discord.Snowflake, EneAudio>}
     */
    this.audios = {};

    if (!existsSync('./cache')) {
      mkdirSync('./cache');
    }

    /**
     * @type {Object.<
     *      string,
     *      Object.<
     *          string,
     *          {color: string, role_id: string, cooldown: number}
     *      >
     *  >}
     */
    if (!existsSync('./cache/colors.json')) {
      writeFileSync('./cache/colors.json', '{}');
    }

    this.colors = require('./cache/colors.json');

    /**
     * @type {Object.<string, {log_id: string}>}
     */
    if (!existsSync('./cache/guilds_info.json')) {
      writeFileSync('./cache/guilds_info.json', '{}');
    }

    this.guilds_info = require('./cache/guilds_info.json');
  }

  run() {
    this._loadCommands();
    this._loadEvents();

    this.login(readFileSync('./config/token.key').toString().trim());

    let that = this;

    // this.on("message", (message) => require("./events/message")(that,
    // message));
  }

  _loadCommands() {
    /**
     * @param {Dirent} value
     */
    const bindFunction =
        (path, value) => {
          path = `${path}/${value.name}`;

          if (value.isDirectory()) {
            readdirSync(path, {
              withFileTypes: true
            }).forEach(v => bindFunction(path, v));
            return;
          }

          let prop = require(path);

          if (!prop.name || !prop.run) {
            console.error(`${path} file not valid.`);
            return;
          }

          this.commandManager[prop.name.toLowerCase()] = prop;

          console.log(`Loaded ${prop.name} command successfuly`);
        }

                         readdirSync('./commands', {
                           withFileTypes: true
                         }).forEach(v => bindFunction('./commands', v));
  }

  _loadEvents() {
    const events = readdirSync('./events');

    events.forEach((value) => {
      this.on(
          value.split('.')[0],
          (...args) => require('./events/' + value)(this, ...args));
      console.log(`Bound ${value.split('.')[0]} event.`);
    });
  }

  /**
   *
   * @param {string} guild_id
   * @param {string} message
   */
  async guildLog(guild_id, message) {
    if (!this.guilds_info[guild_id] || !this.guilds_info[guild_id].log_id) {
      return;
    }

    const chan = await this.channels.fetch(this.guilds_info[guild_id].log_id);

    if (chan.isText()) chan.send(message);
  }
}

module.exports = Ene;
