module.exports.config = {
    name: "نضام",
    version: "1.0.0",
    credits: "𝗬 𝗔 𝗦 𝗦 𝗜 𝗡 𝗘　ツ",
    hasPermission: 2,
    description: "تقييد وتشغيل البوت في مجموعة معينة فقط",
    usages: "[تقييد تشغيل | تقييد إيقاف]",
    commandCategory: "المطور",
    cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
    // إزالة الفراغات الزائدة من بداية ونهاية المدخل
    const command = args[0]?.trim(); // تأكد من عدم وجود فراغات إضافية

    if (!command || !["تقييد تشغيل", "تقييد إيقاف"].includes(command)) {
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

    // إذا تم تقييد البوت في المجموعة، لا يمكن للبوت تنفيذ أي أوامر جديدة
    if (global.botStatus[event.threadID] && command === "تقييد تشغيل") {
        return api.sendMessage(
            "❌| البوت متوقف في هذه المجموعة ولا يمكن تشغيله.",
            event.threadID,
            event.messageID,
        );
    }

    // إذا تم تقييد البوت في هذه المجموعة
    if (command === "تقييد إيقاف") {
        global.botStatus[event.threadID] = true;
        return api.sendMessage(
            "❌| تم تقييد البوت في هذه المجموعة.",
            event.threadID,
            event.messageID,
        );
    }

    // لتفعيل البوت بعد تقييد البوت
    if (command === "تقييد تشغيل") {
        global.botStatus[event.threadID] = false;
        return api.sendMessage(
            "✅| تم تفعيل البوت في هذه المجموعة.",
            event.threadID,
            event.messageID,
        );
    }
};
