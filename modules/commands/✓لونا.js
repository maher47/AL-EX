const axios = require('axios');

module.exports.config = {
    name: "ذكي",
    version: "2.3.4",
    hasPermission: 0,
    credits: "ضفدغ",
    description: "GPT-ذكاء",
    commandCategory: "ذكاء اصطناعي",
    cooldowns: 1
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const userQuery = args.join(" ");

    if (!userQuery) {
        return api.sendMessage("❌ يرجى كتابة سؤال.", threadID, messageID);
    }

    const apiURL = `https://gpt-3-1-fyr1.onrender.com/chat?text=${encodeURIComponent(userQuery)}`;

    try {
        const response = await axios.get(apiURL);

        if (response.data && response.data.reply) {
            const reply = response.data.reply;

            const formattedReply = `
➪ 𝗚𝗣𝗧 𝗦𝗔𝗜𝗞𝗢 🪽
━━━━━━━━━━━━━━━━━━━
${reply}
━━━━━━━━━━━━━━━━━━━
اتـمـنـى ان يـفـيـدك هـذا الـجـواب ✨
            `.trim();

            return api.sendMessage(formattedReply, threadID, messageID);
        } else {
            return api.sendMessage("⚠️ لم يتم العثور على إجابة من الخادم.", threadID, messageID);
        }
    } catch (error) {
        console.error("❌ حدث خطأ أثناء الاتصال بالـ API:\n", error);

        let errorDetails = "❌ حدث خطأ أثناء الاتصال بالـ API.";

        if (error.response) {
            // إذا كان الرد يحتوي على رسالة من السيرفر
            errorDetails += `\n🔹 الحالة: ${error.response.status}\n🔹 السبب: ${error.response.statusText}\n🔹 الرد: ${JSON.stringify(error.response.data)}`;
        } else if (error.request) {
            // إذا تم إرسال الطلب ولكن لم يتم تلقي الرد
            errorDetails += `\n🔹 لم يتم تلقي رد من الخادم.\n🔹 الطلب: ${error.request}`;
        } else {
            // خطأ في الإعداد أو غير ذلك
            errorDetails += `\n🔹 رسالة الخطأ: ${error.message}`;
        }

        return api.sendMessage(errorDetails, threadID, messageID);
    }
};
