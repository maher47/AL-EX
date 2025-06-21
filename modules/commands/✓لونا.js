const axios = require('axios');

module.exports.config = {
    name: "auto_gpt",
    version: "1.0.2",
    hasPermission: 0,
    credits: "Zeno (Modified by Cody)",
    description: "يرد فقط على الأسئلة التي تنتهي بـ '؟' دون أي رموز أو مسافات قبلها",
    commandCategory: "ذكاء اصطناعي",
    cooldowns: 1
};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, body } = event;
    
    if (!body) return;

    let userQuery = body.trim(); // إزالة المسافات الزائدة

    // التحقق مما إذا كانت الجملة تحتوي فقط على حروف وتنتهي بـ "؟"
    if (!/^[\p{L}\p{N}\s]+؟$/u.test(userQuery)) return;

    const apiURL = `https://gpt-3-1-kvgw.onrender.com/chat?text=${encodeURIComponent(userQuery)}`;

    try {
        const response = await axios.get(apiURL);

        if (response.data) {
            const reply = response.data.reply || response.data;
            return api.sendMessage(`🥷 𝗚𝗣𝗧-4 ⓃⒾⓃⓄ 🗨️\n\n${reply}\n\nاتـمـنـى ان يـفـيـدك هـذا الـجـواب ✨`, threadID, messageID);
        } else {
            return api.sendMessage("⚠️ لم يتم العثور على إجابة.", threadID, messageID);
        }
    } catch (error) {
        console.error("Error fetching data from API:", error);
        return api.sendMessage("❌ حدث خطأ أثناء جلب الرد. حاول مرة أخرى لاحقًا.", threadID, messageID);
    }
};

module.exports.run = function () {
    return;
};