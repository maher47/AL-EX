const axios = require('axios');

module.exports.config = {
    name: "لونا",
    version: "2.3.4",
    hasPermission: 0,
    credits: "ضفدغ",
    description: "GPT-لـونا",
    commandCategory: "ذكاء اصطناعي",
    cooldowns: 1
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const userQuery = args.join(" ");

    if (!userQuery) {
        return api.sendMessage("❌ يرجى كتابة سؤال.", threadID, messageID);
    }

    const apiURL = `https://luna-apl-shv0.onrender.com/chat?text=${encodeURIComponent(userQuery)}`;

    try {
        // إرسال الطلب إلى API
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
            return api.sendMessage("⚠️ لم يتم العثور على إجابة.", threadID, messageID);
        }
    } catch (error) {
        console.error("Error fetching data from API:", error);
        return api.sendMessage("❌ حدث خطأ أثناء جلب الرد. حاول مرة أخرى لاحقًا.", threadID, messageID);
    }
};
