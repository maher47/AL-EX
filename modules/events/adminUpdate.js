module.exports.config = {
    name: "adminUpdate",
    eventType: ["log:thread-admins", "log:thread-name", "log:user-nickname", "log:thread-call", "log:thread-icon", "log:thread-color", "log:link-status", "log:magic-words", "log:thread-approval-mode", "log:thread-poll"],
    version: "1.0.2",
    credits: "MrTomXxX",
    description: "Update group information quickly",
    envConfig: {
        sendNoti: true
    }
};

module.exports.run = async function ({ event, api, Threads, Users }) {
    const { author, threadID, logMessageType, logMessageData } = event;
    const { setData, getData } = Threads;
    const fs = require("fs");
    var iconPath = __dirname + "/emoji.json";
    if (!fs.existsSync(iconPath)) fs.writeFileSync(iconPath, JSON.stringify({}));
    if (author == threadID) return;

    try {
        let dataThread = (await getData(threadID)).threadInfo;
        if (!dataThread.nicknames) dataThread.nicknames = {}; // Ensure nicknames object exists

        switch (logMessageType) {
            case "log:thread-admins": {
                if (logMessageData.ADMIN_EVENT == "add_admin") {
                    dataThread.adminIDs.push({ id: logMessageData.TARGET_ID });
                    api.sendMessage(
                        `🔰【 تحديث مسؤول المجموعة 】🔰\n➤ المستخدم: ${logMessageData.TARGET_ID}\n➤ الحالة: تم تعيينه مشرفًا رسميًا 🔐\n━━━━━━━━━━━━━━━`,
                        threadID
                    );
                } else if (logMessageData.ADMIN_EVENT == "remove_admin") {
                    dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != logMessageData.TARGET_ID);
                    api.sendMessage(
                        `🔰【 تحديث مسؤول المجموعة 】🔰\n➤ المستخدم: ${logMessageData.TARGET_ID}\n➤ الحالة: تم إلغاء صلاحيات المشرف ❌\n━━━━━━━━━━━━━━━`,
                        threadID
                    );
                }
                break;
            }

            case "log:user-nickname": {
                const participantID = logMessageData.participant_id;
                const newNickname = logMessageData.nickname || "";
                dataThread.nicknames[participantID] = newNickname;
                const message = newNickname.length === 0
                    ? `✨【 تحديث لقب المستخدم 】✨\n➤ المستخدم: ${participantID}\n➤ الكنية: تم إزالتها بنجاح ✔️\n━━━━━━━━━━━━━━━`
                    : `✨【 تحديث لقب المستخدم 】✨\n➤ المستخدم: ${participantID}\n➤ الكنية الجديدة: ${newNickname}\n━━━━━━━━━━━━━━━`;
                api.sendMessage(message, threadID);
                break;
            }

            case "log:thread-name": {
                dataThread.threadName = event.logMessageData.name || null;
                const message = dataThread.threadName
                    ? `🏷️【 تحديث اسم المجموعة 】🏷️\n➤ الاسم الجديد: ${dataThread.threadName}\n━━━━━━━━━━━━━━━`
                    : `🏷️【 تحديث اسم المجموعة 】🏷️\n➤ تم حذف اسم المجموعة ❗\n━━━━━━━━━━━━━━━`;
                api.sendMessage(message, threadID);
                break;
            }

            case "log:thread-icon": {
                let preIcon = JSON.parse(fs.readFileSync(iconPath));
                dataThread.threadIcon = event.logMessageData.thread_icon || "👍";
                api.sendMessage(
                    `🖼️【 تحديث أيقونة المجموعة 】🖼️\n➤ الإيموجي السابق: ${preIcon[threadID] || "غير واضح"}\n➤ الإيموجي الجديد: ${dataThread.threadIcon}\n━━━━━━━━━━━━━━━`,
                    threadID
                );
                preIcon[threadID] = dataThread.threadIcon;
                fs.writeFileSync(iconPath, JSON.stringify(preIcon));
                break;
            }

            case "log:thread-call": {
                if (logMessageData.event == "group_call_started") {
                    const name = await Users.getNameUser(logMessageData.caller_id);
                    const callType = logMessageData.video ? "فيديو" : "صوت";
                    api.sendMessage(
                        `📞【 مكالمة جديدة 】📞\n➤ المستخدم: ${name}\n➤ نوع المكالمة: ${callType}\n➤ الحالة: تم بدء المكالمة بنجاح ▶️\n━━━━━━━━━━━━━━━`,
                        threadID
                    );
                } else if (logMessageData.event == "group_call_ended") {
                    const callDuration = logMessageData.call_duration;
                    let hours = Math.floor(callDuration / 3600);
                    let minutes = Math.floor((callDuration - (hours * 3600)) / 60);
                    let seconds = callDuration - (hours * 3600) - (minutes * 60);
                    if (hours < 10) hours = "0" + hours;
                    if (minutes < 10) minutes = "0" + minutes;
                    if (seconds < 10) seconds = "0" + seconds;
                    const timeFormat = `${hours}:${minutes}:${seconds}`;
                    const callType = logMessageData.video ? "فيديو" : "صوت";
                    api.sendMessage(
                        `⏹️【 انتهاء المكالمة 】⏹️\n➤ المدة: ${timeFormat}\n➤ نوع المكالمة: ${callType}\n━━━━━━━━━━━━━━━`,
                        threadID
                    );
                } else if (logMessageData.joining_user) {
                    const name = await Users.getNameUser(logMessageData.joining_user);
                    const callType = logMessageData.group_call_type == "1" ? "فيديو" : "صوت";
                    api.sendMessage(
                        `👥【 انضمام لمكالمة 】👥\n➤ المستخدم: ${name}\n➤ نوع المكالمة: ${callType}\n➤ الحالة: انضمام ناجح ✔️\n━━━━━━━━━━━━━━━`,
                        threadID
                    );
                }
                break;
            }

            case "log:magic-words": {
                api.sendMessage(
                    `✨【 تحديث تأثيرات الكلمات 】✨\n➤ السمة: ${event.logMessageData.magic_word}\n➤ التأثير: ${event.logMessageData.theme_name}\n➤ الإيموجي: ${event.logMessageData.emoji_effect || "لا يوجد إيموجي"}\n➤ إجمالي التأثيرات: ${event.logMessageData.new_magic_word_count}\n━━━━━━━━━━━━━━━`,
                    threadID
                );
                break;
            }

            case "log:thread-poll": {
                if (event.logMessageData.event_type == "question_creation" || event.logMessageData.event_type == "update_vote") {
                    api.sendMessage(
                        `🗳️【 تحديث التصويت 】🗳️\n➤ ${event.logMessageBody}\n━━━━━━━━━━━━━━━`,
                        threadID
                    );
                }
                break;
            }

            case "log:thread-approval-mode": {
                api.sendMessage(
                    `⚙️【 تحديث وضع الموافقة 】⚙️\n➤ ${event.logMessageBody}\n━━━━━━━━━━━━━━━`,
                    threadID
                );
                break;
            }

            case "log:thread-color": {
                dataThread.threadColor = event.logMessageData.thread_color || "🌤";
                api.sendMessage(
                    `🎨【 تحديث لون المجموعة 】🎨\n➤ اللون الجديد: ${dataThread.threadColor}\n━━━━━━━━━━━━━━━`,
                    threadID
                );
                break;
            }
        }

        await setData(threadID, { threadInfo: dataThread });
    } catch (e) {
        console.log(e);
    }
};
