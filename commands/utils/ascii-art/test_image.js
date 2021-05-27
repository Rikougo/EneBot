/**
 * @author Sakeiru
 */
const Discord = require('discord.js');
const {ApplicationCommandOptionType} = require('discord.js').Constants;
const Jimp = require('jimp');

const {
  existsSync,
  writeFileSync,
  mkdirSync,
} = require('fs');

const SCALES = [' ', '.', '-', '/', '@'];

const BLOCK_SIZE = 2;

/**
 *
 * @param {import('../../Ene')} client
 * @param {Discord.Message} message
 * @param {string[]} args
 */
const test_image = (client, message, args) => {
  if (message.attachments.size === 0) {
    message.react('❌');
    message.reply('Please submit an image file (png only).');
    return;
  }

  let image = message.attachments.first();

  if (!image.name.endsWith('.png')) {
    message.react('❌');
    message.reply('Only support png files.');
    return;
  }

  console.log(image.url);

  Jimp.read(image.url, (err, img) => {
    if (err) {
      message.reply(err.message);
      return;
    }

    let gc = img.greyscale();

    console.log(gc.bitmap);

    let result = '```\n';

    let data = [];

    for (let y = 0; y < gc.bitmap.height; y++) {
      for (let x = 0; x < gc.bitmap.width; x++) {
        let scale = (gc.getPixelColor(x, y) >> 8 >>> 0) & 0xff;

        let symbol_index =
            Math.floor(((255 - Math.max(1, scale)) / 255) * SCALES.length);

        if (symbol_index < 0 || symbol_index >= SCALES.length) {
          console.log(symbol_index + ' | ' + scale);
        }

        let blockY = Math.floor(y / BLOCK_SIZE),
            blockX = Math.floor(x / BLOCK_SIZE);

        if (data[blockY]) {
          if (data[blockY][blockX]) {
            data[blockY][blockX] = (data[blockY][blockX] + scale) / 2;
          } else {
            data[blockY].push(scale);
          }
        } else {
          data.push([scale]);
        }

        result += SCALES[symbol_index];
      }
      result += '\n';
    }

    result += '```';

    let trueResult = '```\n';

    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < data[0].length; x++) {
        let symbol_index =
            Math.floor(((255 - Math.max(1, data[y][x])) / 255) * SCALES.length);

        trueResult += SCALES[symbol_index];
      }
      trueResult += '\n';
    }

    trueResult += '```';

    if (result.length < 2000) {
      message.channel.send(result);
    } else {
      if (!existsSync('./temp')) mkdirSync('./temp');

      let file = `./temp/${Date.now()}.txt`;

      writeFileSync(file, trueResult);

      message.channel.send({files: [{attachment: file, name: file}]});
    }
  });
};

module.exports = {
  name: 'test_image',
  run: test_image
};