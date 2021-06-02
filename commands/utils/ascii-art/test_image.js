/**
 * @author Sakeiru
 */
const Discord = require('discord.js');
const {ApplicationCommandOptionType} = require('discord.js').Constants;
const Jimp = require('jimp');
const {createCanvas} = require('canvas');

const {
  existsSync,
  writeFileSync,
  mkdirSync,
  unlinkSync,
} = require('fs');

const SCALES = '@%#*+=-:. ';

const BLOCK_SIZE = 2;

/**
 *
 * @param {import('../../Ene')} client
 * @param {Discord.Message} message
 * @param {string[]} args
 */
const test_image = async (client, message, args) => {
  if (message.attachments.size === 0) {
    message.react('❌');
    message.reply('Please submit an image file.');
    return;
  }

  let block_size = args.shift() || BLOCK_SIZE;

  let returnImage = args.includes('--image') || args.includes('-i') || false;

  let image = message.attachments.first();

  Jimp.read(image.url, async (err, img) => {
    if (err) {
      message.reply(`Error during process :\n\`\`\`\n${err.message}\`\`\``);
      return;
    }

    let gc = img.greyscale();

    let data = [];

    // iter through every pixels and add grayscale value to the correct block
    for (let y = 0; y < gc.bitmap.height; y++) {
      for (let x = 0; x < gc.bitmap.width; x++) {
        let scale = (gc.getPixelColor(x, y) >> 8 >>> 0) & 0xff;

        let blockY = Math.floor(y / block_size),
            blockX = Math.floor(x / block_size);

        if (data[blockY]) {
          if (data[blockY][blockX]) {
            data[blockY][blockX] = (data[blockY][blockX] + scale) / 2;
          } else {
            data[blockY].push(scale);
          }
        } else {
          data.push([scale]);
        }
      }
    }

    let trueResult = '';

    // iter through blocks to build string
    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < data[0].length; x++) {
        let symbol_index =
            Math.floor(((255 - Math.max(1, data[y][x])) / 255) * SCALES.length);

        if (symbol_index < 0 || symbol_index >= SCALES.length) {
          console.log(
              'ASCII img converter : error during char index search. Index : ' +
              symbol_index + ' | Scale : ' + scale);
        }

        trueResult += SCALES[symbol_index];
      }
      trueResult += '\n';
    }

    if (!returnImage) {
      if (trueResult.length < 1950) {
        message.channel.send(`\`\`\`\n${trueResult}\`\`\``);
      } else {
        if (!existsSync('./temp')) mkdirSync('./temp');

        let file = `./temp/${Date.now()}.txt`;

        writeFileSync(file, trueResult);

        await message.channel.send({files: [{attachment: file, name: file}]});

        unlinkSync(file);
      }
    } else {
      const font_size = Math.max(15, block_size);

      const width = data[0].length * font_size;
      const height = data.length * font_size;

      const canvas = createCanvas(width, height);
      const context = canvas.getContext('2d');

      context.fillStyle = '#36393f';
      context.fillRect(0, 0, width, height);

      context.fillStyle = '#ffffff';
      context.font = `regular ${font_size}px monospace`;

      for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[0].length; x++) {
          let symbol_index = Math.floor(
              ((255 - Math.max(1, data[y][x])) / 255) * SCALES.length);

          context.fillText(SCALES[symbol_index], x * font_size, y * font_size);
        }
      }

      let file = `./temp/${Date.now()}.png`
      writeFileSync(file, canvas.toBuffer('image/png'));

      await message.channel.send({files: [{attachment: file, name: file}]});

      unlinkSync(file);
    }
  });
};

module.exports = {
  name: 'test_image',
  run: test_image
};