const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibot",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "Mod by John Lester, updated by Grok",
  description: "goibot",
  commandCategory: "𝕊𝔸𝕐",
  usages: "noprefix",
  cooldowns: 5,
};

module.exports.handleEvent = async function ({ api, event, args, Threads, Users }) {
  var { threadID, messageID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = [
    "وينك كنت؟ 👀",
    "قلبي برد 🧊",
    "سيكو مشتاق 🥹",
    "أنا سامعك من بعيد 👂",
    "ما تنسانيش يا طيب 🥺",
    "حسيتك ناديتني 👀",
    "الدنيا برد وقلبي ثلج 🧊",
    "تعال نحكي شوي ✨",
    "مزاجي مش تمام اليوم 😶‍🌫️",
    "سيكو يراقب 👀",
    "وينك؟ الدنيا فاضية بدونك 👻",
    "سيكو سهران يفكر فيك 🌙",
    "يا سلام! سيكو موجود دايمًا لك 😎",
    "ناديتني؟ قلبي معاك 💖",
    "سيكو هنا، وش عندك؟ 😏",
    "الجو بارد بس سيكو يدفيك 🔥",
    "وينك مختفي؟ سيكو ينتظرك 🕒",
    "سيكو يفكر: إنت ليه كيوت كذا؟ 😻",
    "هلا بالغالي! سيكو جاهز للدردشة 🌟",
    "سيكو يقول: خليك قريب دايمًا 🫶"
  ];

  if (!global.usedResponses) {
    global.usedResponses = new Map();
  }

  let usedResponses = global.usedResponses.get(threadID) || [];

  if (usedResponses.length >= tl.length) {
    usedResponses = [];
  }

  let availableResponses = tl.filter(response => !usedResponses.includes(response));

  let rand = availableResponses[Math.floor(Math.random() * availableResponses.length)];

  usedResponses.push(rand);
  global.usedResponses.set(threadID, usedResponses);

  if (event.body.indexOf("سيكو") == 0 || (event.body.indexOf("سيكو") == 0)) {
    var msg = {
      body: `${rand}`
    }
    return api.sendMessage(msg, threadID, messageID);
  }
}

module.exports.run = function ({ api, event, client, __GLOBAL }) { }
