import { Guild, MessageEmbed, StreamDispatcher, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";
import * as ytdl from "ytdl-core";
import Youtube, { Video, YouTube } from "popyt";
import { Ene } from "../ene";
import { Readable } from "stream";

export class AudioManager {
    static YTBCHECK : RegExp = RegExp("^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$");

    private readonly youtube : YouTube;

    connection: VoiceConnection | undefined;
    textChannel: TextChannel | undefined;

    dispatcher: StreamDispatcher | undefined;

    current: Video | undefined;

    _queue: Array<Video> = [];

    constructor(
        private client: Ene, 
        private guild: Guild
    ) { this.youtube = client.youtube }

    public async connect(voiceChannel: VoiceChannel, textChannel: TextChannel) {
        this.textChannel = textChannel;
        this.connection = await voiceChannel.join();

        let that = this;

        this.connection.on("disconnect", () => {
            that.textChannel!.send("Disconnected.");

            that._reset();
        });
    }

    public async disconnect() {
        if (this.connection) {
            this.connection.disconnect();
        }
    }
    
    public async queue() {
        return this._queue;
    }

    public async play(songURL: string, forceNext: boolean = false) {
        let that = this;

        let video : Video;

        if (!AudioManager.YTBCHECK.test(songURL)) {
            songURL = (await this.youtube.searchVideos(songURL, 1)).results[0].url;
        }

        video = await this.youtube.getVideo(songURL);

        if (!this.dispatcher || forceNext) {
            let song = ytdl.default(
                songURL,
                {filter: "audioonly"}
            );

            this.dispatcher = this.connection!.play(song);

            this.dispatcher.on("finish", () => {
                that.dispatcher = undefined;

                that.skip();
            });

            const embed = new MessageEmbed()
                .setAuthor("Now playing")
                .setTitle(video.title)
                .setURL(video.url)
                .setColor("#fb40ff")
                .setThumbnail(video.thumbnails.medium!.url!)
                .setDescription(`Duration : \`${video.minutes}:${video.seconds}\``)
                .setFooter("Freydish", this.client.user!.avatarURL()!);

            await this.textChannel!.send(embed);

            this.current = video;
        } else {
            this._queue.push(video);

            await this.textChannel!.send(`**Added ** \`${video.title!}\` **to queue.**`);
        }
    }

    public async skip() {
        if (this.dispatcher) {
            this.dispatcher.pause();
            this.dispatcher = undefined;
            this.current = undefined;
        }

        if (this._queue.length === 0) {
            await this.textChannel!.send("**No song next**");
        } else {
            await this.play(this._queue.shift()!.url, true);
        }
    }

    public async pause() {
        if (this.dispatcher){
            if (this.dispatcher.paused){
                this.dispatcher.resume();

                await this.textChannel!.send("Resumed `" + this.current!.title + "`.");
            } else {
                this.dispatcher.pause();
                
                await this.textChannel!.send("Paused `" + this.current!.title + "`.");
            }
        } else {
            await this.textChannel!.send("No song playing.");
        }
    }

    private async _reset() {
        this.connection = undefined;
        this.textChannel = undefined;

        this.dispatcher = undefined;
        this.current = undefined;

        this._queue = [];
    }
}