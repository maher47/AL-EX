module.exports.config = {
    name: "تقيد",
    version: "1.0.0",
    credits: "𝗬 𝗔 𝗦 𝗦 𝗜 𝗡 𝗘　ツ",
    hasPermission: 2,
    description: "تقييد تشغيل وإيقاف البوت في مجموعة معينة",
    usages: "[تقييد تشغيل | تقييد إيقاف]",
    commandCategory: "المطور",
    cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
    if (!args[0] || !["تقييد تشغيل", "تقييد إيقاف"].includes(args[0])) {
        return api.sendMessage(
            "يرجى تحديد قيمة صالحة: 'تقييد تشغيل' أو 'تقييد إيقاف'.",
            event.threadID,
            event.messageID,
        );
    }

    // تحديد الصلاحيات لمستخدمي البوت
    const permission = ["100093440923797", "100003599438875"];
    if (!permission.includes(event.senderID)) {
        return api.sendMessage(
            "لا تمتلك الصلاحية الكافية لاستخدام هذا الأمر.",
            event.threadID,
            event.messageID,
        );
    }

    // متغير لتخزين حالة البوت لكل مجموعة
    global.botStatus = global.botStatus || {};

    // إذا كان البوت مقيدًا في المجموعة
    if (global.botStatus[event.threadID] && args[0] === "تقييد تشغيل") {
        return api.sendMessage(
            "❌| البوت متوقف في هذه المجموعة ولا يمكن تشغيله.",
            event.threadID,
            event.messageID,
        );
    }

    // تقييد إيقاف البوت
    if (args[0] === "تقييد إيقاف") {
        global.botStatus[event.threadID] = true;
        return api.sendMessage(
            "❌| تم تقييد إيقاف البوت في هذه المجموعة.",
            event.threadID,
            event.messageID,
        );
    }

    // لتقييد تشغيل البوت بعد تقييده
    if (args[0] === "تقييد تشغيل") {
        global.botStatus[event.threadID] = false;
        return api.sendMessage(
            "✅| تم تقييد تشغيل البوت في هذه المجموعة.",
            event.threadID,
            event.messageID,
        );
    }
};
