const utils = require("../../assets/utils")

module.exports = {
    run: async (i) => {
        return i.message.channel.send("```" + i.trim(util.inspect(i.argv), 2000 - 6) + "```");
    }
}