module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = require("string-similarity"),
    escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    logger = require("../../utils/log.js");
  const moment = require("moment-timezone");

  // تخزين عدد مرات إرسال أمر غير معروف لكل مستخدم في كل محادثة
  const unknownCommandCounter = new Map();

  return async function ({ event }) {
    const dateNow = Date.now();
    const time = moment.tz("Asia/Manila").format("HH:mm:ss DD/MM/YYYY");
    const { allowInbox, PREFIX, ADMINBOT, DeveloperMode, adminOnly, YASSIN } = global.config;

    const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data;
    const { commands, cooldowns } = global.client;

    var { body, senderID, threadID, messageID } = event;

    senderID = String(senderID);
    threadID = String(threadID);
    const threadSetting = threadData.get(threadID) || {};
    const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : PREFIX;

    if (!body || !body.startsWith(prefix)) return;

    const prefixRegex = new RegExp(`^${escapeRegex(prefix)}`);
    const matchedPrefix = body.match(prefixRegex)[0];
    const args = body.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    var command = commands.get(commandName);

    if (YASSIN === "true" && !ADMINBOT.includes(senderID)) return;

    // تعديل رسائل الأوامر غير المعروفة
    if (!command) {
      const userKey = `${senderID}_${threadID}`;
      const prev = unknownCommandCounter.get(userKey) || 0;

      if (prev === 0) {
        api.sendMessage(`✅ | ه‍ا..؟ غـيـر مـوجـود 🤔 هـلا قـصـدك: ابتيم ؟`, threadID, messageID);
        unknownCommandCounter.set(userKey, 1);
      } else {
        api.sendMessage(`هاهاها 😂 غـيـر مـوجـود يـا ذكـي! يمكن كنت تقصد: تخيل 🔍`, threadID, messageID);
        unknownCommandCounter.set(userKey, 0);
      }

      return;
    }

    if (userBanned.has(senderID) || threadBanned.has(threadID) || (allowInbox === false && senderID == threadID)) {
      if (!ADMINBOT.includes(senderID)) {
        if (userBanned.has(senderID)) {
          const { reason, dateAdded } = userBanned.get(senderID) || {};
          return api.sendMessage(
            global.getText("handleCommand", "userBanned", reason, dateAdded),
            threadID,
            async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5000));
              return api.unsendMessage(info.messageID);
            },
            messageID
          );
        } else if (threadBanned.has(threadID)) {
          const { reason, dateAdded } = threadBanned.get(threadID) || {};
          return api.sendMessage(
            global.getText("handleCommand", "threadBanned", reason, dateAdded),
            threadID,
            async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5000));
              return api.unsendMessage(info.messageID);
            },
            messageID
          );
        }
      }
    }

    if (commandBanned.get(threadID) || commandBanned.get(senderID)) {
      if (!ADMINBOT.includes(senderID)) {
        const banThreads = commandBanned.get(threadID) || [];
        const banUsers = commandBanned.get(senderID) || [];
        if (banThreads.includes(command.config.name)) {
          return api.sendMessage(
            global.getText("handleCommand", "commandThreadBanned", command.config.name),
            threadID,
            async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5000));
              return api.unsendMessage(info.messageID);
            },
            messageID
          );
        } else if (banUsers.includes(command.config.name)) {
          return api.sendMessage(
            global.getText("handleCommand", "commandUserBanned", command.config.name),
            threadID,
            async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5000));
              return api.unsendMessage(info.messageID);
            },
            messageID
          );
        }
      }
    }

    if (
      command.config.commandCategory.toLowerCase() == "nsfw" &&
      !global.data.threadAllowNSFW.includes(threadID) &&
      !ADMINBOT.includes(senderID)
    ) {
      return api.sendMessage(
        global.getText("handleCommand", "threadNotAllowNSFW"),
        threadID,
        async (err, info) => {
          await new Promise(resolve => setTimeout(resolve, 5000));
          return api.unsendMessage(info.messageID);
        },
        messageID
      );
    }

    var permssion = 0;
    const threadInfoo = threadInfo.get(threadID) || await Threads.getInfo(threadID);
    const find = threadInfoo.adminIDs.find(el => el.id == senderID);
    if (ADMINBOT.includes(senderID)) permssion = 2;
    else if (find) permssion = 1;
    if (command.config.hasPermssion > permssion) {
      return api.sendMessage(
        global.getText("handleCommand", "permssionNotEnough", command.config.name),
        threadID,
        messageID
      );
    }

    if (!cooldowns.has(command.config.name)) {
      cooldowns.set(command.config.name, new Map());
    }
    const timestamps = cooldowns.get(command.config.name);
    const expirationTime = (command.config.cooldowns || 1) * 1000;
    if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime) {
      return api.setMessageReaction("⏳", messageID, err => err ? logger("Cooldown error", 2) : "", true);
    }

    var getText2;
    if (command.languages && typeof command.languages === "object" && command.languages.hasOwnProperty(global.config.language)) {
      getText2 = (...values) => {
        var lang = command.languages[global.config.language][values[0]] || "";
        for (var i = values.length - 1; i > 0; i--) {
          const expReg = RegExp("%" + i, "g");
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
    } else {
      getText2 = () => {};
    }

    try {
      const Obj = {
        api,
        event,
        args,
        models,
        Users,
        Threads,
        Currencies,
        permssion,
        getText: getText2
      };
      await command.run(Obj);
      timestamps.set(senderID, dateNow);
      if (DeveloperMode) {
        logger(
          global.getText("handleCommand", "executeCommand", time, commandName, senderID, threadID, args.join(" "), Date.now() - dateNow),
          "[ DEV MODE ]"
        );
      }
      return;
    } catch (e) {
      return api.sendMessage(global.getText("handleCommand", "commandError", commandName, e), threadID);
    }
  };
};
