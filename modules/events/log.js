module.exports.config = {
    name: "log",
    eventType: ["log:unsubscribe", "log:subscribe"],
    version: "1.0.0",
    credits: "𝐊𝐈𝐓𝐄 凧",
    description: "Record bot activity notifications!",
    envConfig: {
      enable: true
    }
};

module.exports.run = async function ({ api, event, Users, Threads }) {
    const logger = require("../../utils/log");
    if (!global.configModule[this.config.name].enable) return;
    let botID = api.getCurrentUserID();
    var allThreadID = global.data.allThreadID;
    for (const singleThread of allThreadID) {
      const thread = global.data.threadData.get(singleThread) || {};
      if (typeof thread["log"] != "undefined" && thread["log"] == false) return;
    }
    
    const moment = require("moment-timezone");
    const time = moment.tz("africa/morocco").format("D/MM/YYYY HH:mm:ss");
    let nameThread = global.data.threadInfo.get(event.threadID).threadName || "Name does not exist"; 
    let threadInfo = await api.getThreadInfo(event.threadID);
    nameThread = threadInfo.threadName;
    const nameUser = global.data.userName.get(event.author) || await Users.getNameUser(event.author);
  
    console.log(nameThread)
  
    var formReport = "[🔰]【 تحديث مسؤول المجموعة 】[🔰]" +
      "\n\n➤ إسم المجموعة: " + nameThread +
      "\n➤ معرف المجموعة: " + event.threadID +
      "\n\n━━━━━━━━━━━━━━━" +
      "\n\n➤ المستخدم: @" + nameUser +
      "\n➤ معرف المستخدم: " + event.author +
      "\n\n━━━━━━━━━━━━━━━" +
      "\n\n🕒 الوقت: " + time + "";
    let task = "";
  
    switch (event.logMessageType) {
      case "log:subscribe": {
        if (event.logMessageData.addedParticipants.some(i => i.userFbId == botID)) {
            task = "[⚜️] تم إضافة البوت إلى مجموعة جديدة";
        }
        break;
      }
      case "log:unsubscribe": {
        if (event.logMessageData.leftParticipantFbId == botID) {
          if (event.senderID == botID) return;
          // فقط إشعار الطرد، بدون حظر أو سبب
          task = "[⚜️] المستخدم قام بطرد البوت من المجموعة";
        }
        break;
      }
      default:
        break;
    }
  
    if (task.length == 0) return;
  
    formReport = formReport
      .replace(/\{task}/g, task);
  
    return api.sendMessage(formReport, global.config.ADMINBOT[0], (error, info) => {
      if (error) return logger(formReport, "Logging Event");
    });
};
