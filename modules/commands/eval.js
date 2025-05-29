const util = require("util");

module.exports.config = {
  name: "eval",
  version: "1.0.0",
  hasPermission: 2,
  credits: "ChatGPT",
  description: "Execute JavaScript code",
  commandCategory: "developer",
  usages: "[code]",
  cooldowns: 1
};

module.exports.run = async function({ api, event, args }) {
  const code = args.join(" ");
  if (!code) return api.sendMessage("No code provided.", event.threadID, event.messageID);

  try {
    const logs = [];
    const log = (...input) => logs.push(...input.map(i => typeof i === "string" ? i : util.inspect(i)));
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const result = await (async () => {
      const console = { log };
      const send = (msg) => api.sendMessage(msg, event.threadID);
      return await eval(`(async () => { ${code} })()`);
    })();

    const output = [...logs, result].filter(Boolean).join("\n");
    if (output) {
      api.sendMessage(output.length > 2000 ? output.slice(0, 1997) + "..." : output, event.threadID, event.messageID);
    }
  } catch (err) {
    api.sendMessage("Error:\n" + err.message, event.threadID, event.messageID);
  }
};
