import { Guild, MessageEmbed, StreamDispatcher, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";
import * as ytdl from "ytdl-core";
import Youtube, { Video, YouTube } from "popyt";
import { Ene } from "../ene";
import { Readable } from "stream";
import { type } from "os";

export class AudioManager {
    static YTBCHECK : RegExp = RegExp("^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$");

    private readonly youtube : YouTube;

    connection: VoiceConnection | undefined;
    textChannel: TextChannel | undefined;

    dispatcher: StreamDispatcher | undefined;

    current: QueueElement | undefined;

    _queue: Array<QueueElement> = [];

    constructor(
        private client: Ene, 
        private guild: Guild
    ) { this.youtube = client.youtube }

    /**
     * Connect client and cache voice and text channels
     * @param voiceChannel the voice channel to play in
     * @param textChannel text channel to keep up the stream activity
     */
    public async connect(voiceChannel: VoiceChannel, textChannel: TextChannel) {
        this.textChannel = textChannel;
        this.connection = await voiceChannel.join();

        let that = this;

        this.connection.on("disconnect", async () => {
            await that.textChannel!.send("Disconnected.");

            that._reset();
        });
    }

    /**
     * Disconnect the voice connection
     */
    public disconnect() {
        if (this.connection) {
            this.connection.disconnect();
        }
    }
    
    /**
     * Return queue of videos (not queue element)
     */
    public queue() : Video[] {
        return this._queue.map(v => v.video);
    }

    /**
     * Search the video using popyt by URL or Title. If a song is currently playing will push it
     * to the end of the queue otherwise it will download the video audio using ytdl and set a stream with it playing
     * @param songURL the song url or title
     * @param forceNext will force the play even if there's a current video
     * @param startTime start the stream at given time (in s)
     */
    public async play(songURL: string, forceNext: boolean = false, startTime: number = 0) {
        if (!this.connection) return;

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

            this.dispatcher = this.connection!.play(song, {seek: startTime});

            this.dispatcher.on("finish", () => {
                that.dispatcher = undefined;

                that.skip();
            });
            
            if (startTime === 0) {
                const embed = new MessageEmbed()
                    .setAuthor("Now playing")
                    .setTitle(video.title)
                    .setURL(video.url)
                    .setColor("#fb40ff")
                    .setThumbnail(video.thumbnails.medium!.url!)
                    .setDescription(`Duration : \`${video.minutes}:${video.seconds}\``)
                    .setFooter("Freydish", this.client.user!.avatarURL()!);
    
                await this.textChannel!.send(embed);
            }

            this.current = {video: video, startTime: startTime};
        } else {
            this._queue.push({video: video, startTime: startTime});

            await this.textChannel!.send(`**Added ** \`${video.title!}\` **to queue.**`);
        }
    }

    /**
     * Skip by forcing the top queue to play
     */
    public async skip() {
        if (this.dispatcher) {
            this.dispatcher.pause();
            this.dispatcher = undefined;
            this.current = undefined;
        }

        if (this._queue.length === 0) {
            await this.textChannel!.send("**No song next**");
        } else {
            await this.play(this._queue.shift()!.video.url, true);
        }
    }

    /**
     * Pause or resume the audio stream
     */
    public async pause() {
        if (this.dispatcher){
            if (this.dispatcher.paused){
                this.dispatcher.resume();

                await this.textChannel!.send("Resumed `" + this.current!.video.title + "`.");
            } else {
                this.dispatcher.pause();
                
                await this.textChannel!.send("Paused `" + this.current!.video.title + "`.");
            }
        } else {
            await this.textChannel!.send("No song playing.");
        }
    }

    /**
     * Set all the AudioManager vars to undefined and empty queue
     */
    private _reset() {
        this.connection = undefined;
        this.textChannel = undefined;

        this.dispatcher = undefined;
        this.current = undefined;

        this._queue = [];
    }
}

class QueueElement {
    constructor(
        public video: Video,
        public startTime: number
    ) { }
}