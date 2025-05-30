module.exports.config = {
  name: "ابتيم",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mustapha",
  description: "عرض معلومات السيرفر وعدد المجموعات والمستخدمين",
  commandCategory: "النظام",
  usages: "ابتيم",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, Threads, Users }) {
  const os = require("os");
  const moment = require("moment-timezone");

  // بيانات مدة التشغيل
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  // بيانات الرام والمعالج
  const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
  const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
  const usedMem = totalMem - freeMem;
  const memUsage = ((usedMem / totalMem) * 100).toFixed(0);

  const cpuModel = os.cpus()[0].model;
  const cpuCores = os.cpus().length;
  const osType = `${os.type()} ${os.release()}`;
  const currentTime = moment.tz("Africa/Algiers").format("YYYY-MM-DD | HH:mm:ss");

  // عدد المجموعات وعدد المستخدمين
  const allThreads = await Threads.getAll();
  const totalGroups = allThreads.length;

  const allUsers = await Users.getAll();
  const totalUsers = allUsers.length;

  const message = `
== 📊 بيانات السيرفر 📊 ==

⏳ مدة تشغيل البوت: ${hours} ساعة ${minutes} دقيقة ${seconds} ثانية ✅

🖥️ نظام التشغيل: ${osType} ✅

🧠 عدد الأنوية: ${cpuCores} ✅

⚙️ نوع المعالج: ${cpuModel} ✅

💾 ذاكرة كلية: ${totalMem} MB ✅

📉 ذاكرة متاحة: ${freeMem} MB ✅

📊 استهلاك الرام: ${memUsage}% ✅

🕰️ الوقت الحالي: ${currentTime} ✅

👥 عدد المستخدمين في البوت: ${totalUsers} ✅

📚 عدد المجموعات في البوت: ${totalGroups} ✅
`;

  return api.sendMessage(message, event.threadID, event.messageID);
};
