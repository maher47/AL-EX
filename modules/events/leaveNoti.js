module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.1",
  credits: "000101",
  description: "Notify bots or leavers",
  dependencies: {}
};

module.exports.run = async function({ api, event, Users }) {
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const { threadID } = event;
  const leftID = event.logMessageData.leftParticipantFbId;
  const authorID = event.author;
  const name = global.data.userName.get(leftID) || await Users.getNameUser(leftID);

  let msg = "";

  if (authorID === leftID) {
    msg = `الاسم: ${name}\n🥴 طلعت فجأة زي إعلان اليوتيوب… ما حد طلبه، بس لقيناه قدامنا! 🚫🎬`;
  } else {
    msg = `الاسم: ${name}\nتم طرده من المجموعة، أترمى برا زي الكلاب!`;
  }

  return api.sendMessage({ body: msg }, threadID);
};
