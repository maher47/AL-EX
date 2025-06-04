module.exports.config = {
  name: "وقت",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "عمر",
  description: "يُرسل رسالة تلقائية في كل المجموعات كل نصف ساعة",
  commandCategory: "عام",
  usages: "[start | stop]",
  cooldowns: 5
};

let isSending = false; // حالة الإرسال التلقائي
let intervalId = null;

function getNextTimeString() {
  const date = new Date();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 30) minutes = 30;
  else {
    minutes = 0;
    hour = (hour + 1) % 24;
  }
  const hour12 = hour % 12 || 12;
  const ampm = hour < 12 ? "صباحًا" : "مساءً";
  return minutes === 0
    ? `تمام الساعة ${hour12} ${ampm}`
    : `الساعة ${hour12}:30 ${ampm}`;
}

const INTERVAL = 30 * 60 * 1000; // 30 دقيقة

async function sendToAllGroups(api) {
  try {
    if (!isSending) return; // إذا الإرسال متوقف ما ترسل

    const threads = await api.getThreadList(100, null, ["inbox"]);
    const groups = threads.filter(thread => thread.isGroup);

    const timeString = getNextTimeString();
    const message = `⏰ في ${timeString}، ودّعنا الفلنتيام إلى مثواه الأخير. 🕊️`;

    for (const group of groups) {
      api.sendMessage(message, group.threadID);
    }
  } catch (error) {
    console.error("Error sending messages to groups:", error);
  }
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID } = event;
  const command = args[0];

  if (command === "start") {
    if (isSending)
      return api.sendMessage("🚫 الإرسال التلقائي مفعّل بالفعل.", threadID);

    isSending = true;
    intervalId = setInterval(() => {
      sendToAllGroups(api);
    }, INTERVAL);

    api.sendMessage("✅ تم تفعيل الإرسال التلقائي كل نصف ساعة.", threadID);
  } else if (command === "stop") {
    if (!isSending)
      return api.sendMessage("🚫 الإرسال التلقائي متوقف بالفعل.", threadID);

    isSending = false;
    clearInterval(intervalId);
    api.sendMessage("🛑 تم إيقاف الإرسال التلقائي.", threadID);
  } else {
    api.sendMessage(
      `❗️ استخدم الأمر بالشكل:\n${global.config.PREFIX}مطلوب start\nلتشغيل الإرسال\nأو\n${global.config.PREFIX}مطلوب stop\nلإيقاف الإرسال`,
      threadID
    );
  }
};
