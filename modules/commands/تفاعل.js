module.exports.config = {
  name: "reactpost",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "يتفاعل مع منشور على فيسبوك بناءً على رسالة نصية محددة",
  commandCategory: "general",
  usages: "",
  cooldowns: 0
};

module.exports.run = async function({ api, event }) {
  const msg = event.body;

  // تحقق إذا الرسالة تحتوي المتغيرات المطلوبة
  if (!msg.includes("const accountID") || !msg.includes("const reactionToSend")) {
    return api.sendMessage("الرسالة غير بصيغة صحيحة للتفاعل مع المنشور.", event.threadID);
  }

  try {
    // استخراج القيم من الرسالة النصية
    const accountID = msg.match(/const accountID\s*=\s*"(\d+)"/)[1];
    const postNumber = msg.match(/const postNumber\s*=\s*"(\d+)"/)[1];
    const reactionToSend = msg.match(/const reactionToSend\s*=\s*"(\w+)"/)[1];
    const commentEmoji = msg.match(/const commentEmoji\s*=\s*"(.+)"/)[1];

    const postID = `${accountID}_${postNumber}`;

    // تنفيذ التفاعل والتعليق
    await api.reactToPost(postID, reactionToSend);
    await api.createCommentPost(commentEmoji, postID);

    api.sendMessage(`تم التفاعل مع المنشور ${postID} بالتفاعل "${reactionToSend}" والتعليق "${commentEmoji}"`, event.threadID);

  } catch (error) {
    api.sendMessage("حدث خطأ أثناء معالجة الرسالة. تأكد من الصيغة الصحيحة.", event.threadID);
    console.error(error);
  }
};
