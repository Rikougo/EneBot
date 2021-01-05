/**
 * @author Sakeiru
 */
const Discord = require("discord.js");

const ytdl = require("ytdl-core");
const Youtube = require("popyt");
const { Video } = require("popyt");

class EneAudio {
    constructor() {
        /**
         * @type {Discord.VoiceConnection | undefined}
         */
        this.connection = undefined;

        /**
         * @type {Discord.StreamDispatcher | undefined}
         */
        this._dispatcher = undefined;

        /**
         * @type {Video[]}
         */
        this._queue = [];

        /**
         * @type {Video | undefined}
         */
        this._current = undefined;

        /**
         * @type {string}
         */
        let ytbToken = process.env.ytbToken;

        if (!ytbToken) throw new Error("YTB_TOKEN_MISSING");

        /**
         * @type {Youtube}
         */
        this.ytbInfos = new Youtube.YouTube(ytbToken);

        /**
         * @type {boolean}
         */
        this.loop = false;

        /**
         * @type {boolean}
         */
        this.loopQueue = false;

        /**
         * @type {NodeJS.Timeout}
         */
        this._shutDown = undefined;
    }
 
    reset() {
        this._dispatcher = undefined;

        this._queue = [];
        this._current = undefined;

        this.connection = undefined;
    }

    /**
     * 
     * @param {Discord.VoiceChannel} channel 
     */
    async connect(channel) {
        console.log(`Logging to channel ${channel.id}`);

        let that = this;

        this.connection = await channel.join();

        this.connection.on("disconnect", () => {
            that.reset();
        });
    }

    disconnect() {
        this.connection.disconnect();
    }

    /**
     * 
     * @param {string} song song name or url
     * @return {Video}
     */
    async add(song) {
        if (this._shutDown) clearTimeout(this._shutDown);

        let videoObj = await this.ytbInfos.getVideo(song);

        console.log(this.playing);

        if (this.playing) this._queue.push(videoObj);
        else this._play(videoObj);

        return videoObj;
    }

    /**
     * @param {boolean} force
     * @return {boolean} whether there was a song in queue or not
     */
    next(force = false) {
        this._dispatcher.destroy();
        this._dispatcher = undefined;

        if (this.loop && !force) {
            this._play(this._current);
            return;
        }

        let next = this._queue.shift();
        if (next) {
            this._play(next);
            if (this.loopQueue) this._queue.push(next);
        }
        else {
            let that = this;
            this._shutDown = setTimeout(() => that.connection.disconnect(), 60000);
        }

        return next;
    }

    /**
     * 
     * @param {Video} videoObj
     */
    async _play(videoObj) {
        let that = this;

        let readable = ytdl(
            videoObj.url
        );

        this._dispatcher = this.connection.play(readable);

        this._dispatcher.on("error", err => console.log(err));

        this._dispatcher.on("finish", () => {
            that.next();
        })

        this._current = videoObj;
    }

    /**
     * Wether the manager is playing a song or not
     * @type {boolean} 
     * @readonly
     */
    get playing() {
        return this._dispatcher !== undefined;
    }

    /**
     * If the audio is connected
     * @type {boolean}
     * @readonly
     */
    get connected() {
        return this.connection !== undefined;
    }

    /**
     * @type {Video[]}
     * @readonly
     */
    get queue() {
        return this._queue;
    }

    /**
     * @type {Video}
     * @readonly
     */
    get current() {
        return this._current;
    }
}

module.exports = EneAudio;