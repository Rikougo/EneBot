const { isMention } = require("../../utils/util")

module.exports = {
    name: "test",
    run: async (client, message, args) => {
        message.channel.send(isMention(args.shift()));
    }
}