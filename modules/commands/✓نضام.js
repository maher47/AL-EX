module.exports.config = {
    name: "نضام",
    version: "1.0.0",
    credits: "𝗬 𝗔 𝗦 𝗦 𝗜 𝗡 𝗘　ツ",
    hasPermission: 2,
    description: "ايقاف وتشغيل البوت",
    usages: "[تشغيل | إيقاف]",
    commandCategory: "المطور",
    cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
    if (!args[0] || !["تشغيل", "ايقاف"].includes(args[0])) {
        return api.sendMessage(
            "يرجى تحديد قيمة صالحة: 'تشغيل' أو 'إيقاف'.",
            event.threadID,
            event.messageID,
        );
    }

    const permission = ["100003599438875", "100003599438875"];
    if (!permission.includes(event.senderID)) {
        return api.sendMessage(
            "لا تمتلك الصلاحية الكافية لاستخدام هذا الأمر.",
            event.threadID,
            event.messageID,
        );
    }

    const YASSIN = args[0] === "تشغيل" ? "false" : "true";
    global.config.YASSIN = YASSIN;

    const message =
        args[0] === "تشغيل"
            ? "✅| تم تشغيل النظام"
            : "❌| تم ايقاف تشغيل النظام";
    return api.sendMessage(message, event.threadID, event.messageID);
};
