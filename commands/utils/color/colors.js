const Discord = require('discord.js');
const {readFileSync, writeFileSync} = require('fs');
const {getTimeRemaining} = require('../../../utils/util');

module.exports = {
  name: 'color',
  /**
   *
   * @param {import("../../../Ene")} client
   * @param {Discord.Message} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    const BASE_CD = client.colors[message.guild.id]?.COOLDOWN ?? 60 * 60 * 1000;
    const COLOR_REGEX = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

    let color = args.shift();

    if (!COLOR_REGEX.test(color)) {
      message.channel.send(
          'Incorrect color, sir ! (#XXXXXX or #XXX hex colors, type color picker in google)');
      return;
    }

    if (color.length === 4) {
      const colorArray = color.slice(1, 4).split('');
      color = '#' + colorArray[0] + colorArray[0] + colorArray[1] +
          colorArray[1] + colorArray[2] + colorArray[2];
    }

    if (!client.colors[message.guild.id]) {
      console.log(`New entry for ${message.guild.name} [${
          message.guild.id}] to colors file.`);
      client.colors[message.guild.id] = {};
    }

    if (!client.colors[message.guild.id][message.author.id]) {
      console.log(
          `New member for ${message.guild.name} : ${message.author.username}`);
      client.colors[message.guild.id][message.author.id] = {}
    } else if (client.colors[message.guild.id][message.author.id].cooldown) {
      const remainingTime =
          client.colors[message.guild.id][message.author.id].cooldown +
          BASE_CD - Date.now();
      if (remainingTime > 0) {
        const time = getTimeRemaining(remainingTime);
        message.channel.send('You still are on cooldown for ' + time + ' .');
        return;
      }
    }

    const roles =
        message.member.roles.cache.filter(role => role.name === 'color');

    const already_wear = false;

    roles.forEach((v, k) => {
      if (v.hexColor.toLowerCase() === color.toLowerCase()) {
        message.channel.send('You already got this color !');
        already_wear = true;
      } else {
        message.member.roles.remove(v).catch(
            (reson) => 'Error while deleting color role.');
      }
    });

    if (already_wear) {
      return
    }

    let guildRole;

    message.guild.roles.cache.forEach((v, k) => {
      if (v.hexColor === color) {
        guildRole = v
      };
    });

    if (!guildRole) {
      guildRole = await message.guild.roles.create(
          {data: {name: 'color', color: color}});
      console.log(`Created one new color role for ${message.guild.name} with ${
          color} color.`);
    }

    message.member.roles.add(guildRole).catch(
        (reason) => console.log('Error while adding color role' + reason));

    client.colors[message.guild.id][message.author.id].cooldown = Date.now();

    writeFileSync('./cache/colors.json', JSON.stringify(client.colors));
  }
}