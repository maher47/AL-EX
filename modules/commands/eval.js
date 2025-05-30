module.exports.config = {
    name: "eval",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐘-𝐀𝐍𝐁𝐔",
    description: "مش لك",
    commandCategory: "المطور",
    usePrefix: false,
    usages: "",
    cooldowns: 0
};

module.exports.run = async function({ api, args, Users, event, Threads, Nero, utils, client}) {
  try {
  function output(msg) {
      if (typeof msg == "number" || typeof msg == "boolean" || typeof msg == "function")
        msg = msg.toString();
      else if (msg instanceof Map) {
        let text = `Map(${msg.size}) `;
        text += JSON.stringify(mapToObj(msg), null, 2);
        msg = text;
      }
      else if (typeof msg == "object")
        msg = JSON.stringify(msg, null, 2);
      else if (typeof msg == "undefined")
        msg = "undefined";

      api.sendMessage(msg,event.threadID,event.messageID);
    }
    function out(msg) {
      output(msg);
    }
    function mapToObj(map) {
      const obj = {};
      map.forEach(function (v, k) {
        obj[k] = v;
      });
      return obj;
    }
    const cmd = `
    (async () => {
      try {
        ${args.join(" ")}
      }
      catch(err) {
        console.log("eval command", err);
        api.sendMessage(err.message,event.threadID,event.messageID);

        }
    })()`;
    eval(cmd);
  } catch (err) {
    console.log(err)
  }
  }
