const { Guild, GuildMember, TextChannel, MessageEmbed } = require('discord.js');
const EneAudio = require('../lib/EneAudio');

/**
 * 
 * @param {Object} interaction 
 * @param {Map<string, number|string|boolean>} args 
 */
const music = (client, interaction, args) => {
    if (args.has("play")) {
        play(
            client, 
            interaction.guild,
            interaction.channel,
            interaction.member,
            args.get("play").get("this")
        );
    } else if(args.has("skip")) {
        skip(
            client,
            interaction.guild,
            interaction.channel
        );
    } else if(args.has("current")) {
        current(
            client,
            interaction.guild,
            interaction.channel
        )
    } else if(args.has("queue")) {
        queue(
            client,
            interaction.guild,
            interaction.channel
        )
    } else if(args.has("disconnect")) {
        disconnect(
            client, 
            interaction.guild, 
            interaction.channel
        );
    } else {
        interaction.channel.send("WTF you doing mate ?");
    }
};

/**
 * 
 * @param {import('../Ene')} client 
 * @param {Guild} guild 
 * @param {TextChannel}
 * @param {GuildMember} member 
 * @param {string} song 
 */
const play = async (client, guild, channel, member, song) => {
    let voiceChannel = member.voice.channel;

    if (!voiceChannel) { 
        await channel.send("Ghosh... you know that you have to be in a channel !")
        return;    
    }

    if (!(guild.id in client.audios)) client.audios[guild.id] = new EneAudio();
    
    /**
     * @type {EneAudio}
     */
    let audio = client.audios[guild.id];

    if (!audio.connected) await audio.connect(voiceChannel);

    audio.add(song)
        .then(video => {
            channel.send(`Added ${video.title}`);
        })
        .catch(err => {
            channel.send(`Error : Unable to add your song : \`\`\`\n${err}\`\`\``)
        });

};

/**
 * 
 * @param {import('../Ene')} client 
 * @param {Guild} guild 
 * @param {TextChannel} channel 
 */
const current = async (client, guild, channel) => {
    if (!(guild.id in client.audios) || !client.audios[guild.id].connected) {
        await channel.send("Give me rest, I'm not even connected !");
        return;
    }

    if (!client.audios[guild.id].playing) {
        await channel.send("Hmmm... check your ears sir, nothin' playing here.");
        return;
    }

    /**
     * @type {import('popyt').Video}
     */
    let playing = client.audios[guild.id].current;

    let embed = new MessageEmbed()
        .setTitle(`${guild.name}'s song`)
        .setThumbnail(playing.thumbnails.default.url)
        .setAuthor(client.user?.username || "Beep boop", client.user.avatarURL())
        .addField(
            playing.title,
            `${playing.minutes}:${playing.seconds}`
        );

    await channel.send(embed);
};

/**
 * 
 * @param {import('../Ene')} client 
 * @param {Guild} guild 
 * @param {TextChannel} channel 
 */
const queue = async (client, guild, channel) => {
    if (!(guild.id in client.audios) || !client.audios[guild.id].connected) {
        await channel.send("Give me rest, I'm not even connected !");
        return;
    }

    if (!client.audios[guild.id].playing) {
        await channel.send("Hmmm... check your ears sir, nothin' playing here.");
        return;
    }

    /**
     * @type {import('popyt').Video}
     */
    let playing = client.audios[guild.id].current;

    /**
     * @type {import('popyt').Video}
     */
    let queue = client.audios[guild.id].queue;

    let embed = new MessageEmbed()
        .setTitle(`${guild.name}'s song`)
        .setThumbnail(playing.thumbnails.default.url)
        .setAuthor(client.user?.username || "Beep boop", client.user.avatarURL())
        .addField(
            playing.title,
            `${playing.minutes}:${playing.seconds}`
        );

    let queueField = "";
    
    queue.forEach((video, index) => {
        queueField += `\`${index+1}\` : ${video.title}\n [${video.minutes}:${video.seconds}]`;
    });

    embed.addField("Queue", queueField);

    await channel.send(embed);
};

/**
 * 
 * @param {import('../Ene')} client 
 * @param {Guild} guild 
 * @param {TextChannel} channel 
 */
const skip = async (client, guild, channel) => {
    if (!(guild.id in client.audios) || !client.audios[guild.id].connected) {
        await channel.send("Give me rest, I'm not even connected !");
        return;
    }

    if (!client.audios[guild.id].playing) {
        await channel.send("Hmmm... check your ears sir, nothin' playing here.");
        return;
    }

    client.audios[guild.id].skip();
}

/**
 * 
 * @param {import('../Ene')} client 
 * @param {Guild} guild 
 * @param {TextChannel} channel 
 */
const disconnect = async (client, guild, channel) => {
    if (!(guild.id in client.audios) || !client.audios[guild.id].connected) {
        await channel.send("Is it necessary ?");
        return;
    }

    client.audios[guild.id].disconnect();
};

const command = {
    name: "music",
    description: "Let's groove baby :tada:",
    options: [
        {
            type: "SUB_COMMAND",
            name: "play",
            description: "Come on, give it a song.",
            options: [
                {
                    type: "STRING",
                    name: "this",
                    description: "What sould I look for mister ?"
                }
            ]
        },
        {
            type: "SUB_COMMAND",
            name: "skip",
            description: "Current song sucks, right' ?"
        },
        {
            type: "SUB_COMMAND",
            name: "current",
            description: "That sounds good right ? What could it be..."
        },
        {
            type: "SUB_COMMAND",
            name: "queue",
            description: "Wondering what's next huh ?"
        },
        {
            type: "SUB_COMMAND",
            name: "disconnect",
            description: "P-Please... don't get me back to thi-"
        }
    ]
};

module.exports = {
    run: music,
    command: command
};