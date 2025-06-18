const axios = require("axios");

module.exports = {
    name: "ai",
    description: "kinginamo gago",
    nashPrefix: false,
    version: "1.0.0",
    cooldowns: 5,
    aliases: ["gpt4o", "4o"],
    execute(api, event, args, prefix) {
        const { threadID, messageID } = event;
        let prompt = args.join(" ");
        if (!prompt) return api.sendMessage("Please enter a prompt.", threadID, messageID);

        if (!global.handle) global.handle = {};
        if (!global.handle.replies) global.handle.replies = {};

        api.sendMessage(
            "please wait...",
            threadID,
            (err, info) => {
                if (err) return;

                const url = `${global.NashBot.JOSHUA}api/gpt4o-latest?ask=${encodeURIComponent(prompt)}&uid=1&imageUrl=&apikey=609efa09-3ed5-4132-8d03-d6f8ca11b527`;

                axios.get(url)
                    .then(response => {
                        const reply = response.data.response;
                        api.editMessage(reply, info.messageID);
                        global.handle.replies[info.messageID] = {
                            cmdname: module.exports.name,
                            this_mid: info.messageID,
                            this_tid: info.threadID,
                            tid: threadID,
                            mid: messageID,
                        };
                    })
                    .catch(() => {
                        api.editMessage("❌ Failed to get response.", info.messageID);
                    });
            },
            messageID
        );
    },
};
