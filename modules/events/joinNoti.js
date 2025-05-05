module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.4",
    credits: "Yass Ine",
    description: "notifi member join",
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.run = async function({ api, event, Users, Threads }) {
    var fullYear = global.client.getTime("fullYear");
    var getHours = await global.client.getTime("hours");
    var session = `${getHours < 3 ? "بعد منتصف الليل" : getHours < 8 ? "الصباح الباكر" : getHours < 11 ? "وقت الظهيرة" : getHours < 16 ? "قبل الظهر" : getHours < 23 ? "الليل" : "منتصف الليل"}`;
    const { join } = global.nodemodule["path"];
    const { threadID } = event;
    const { PREFIX } = global.config;

    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        return api.sendMessage("[✅]~ تم ارسال طلب للنظام", threadID, async () => {
            api.sendMessage("نجح الاتصال 👾✅", threadID);

            let check = true;
            while (check) {
                setTimeout(() => check = false, 30 * 1000);
                const threadData = (await Threads.getInfo(threadID)) || {};
                if (threadData.hasOwnProperty("adminIDs")) {
                    check = false;
                    api.sendMessage("", threadID, (err, info) => {
                        global.client.handleReply.push({
                            name: "langChoose_0x01042022",
                            messageID: info.messageID,
                            adminIDs: threadData.adminIDs
                        });
                    });
                }
            }

            api.changeNickname(`[ . ] • ${(!global.config.BOTNAME) ? "" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
        }); 
    } else {
        try {
            const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);

            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            const path = join(__dirname, "cache", "joinGif");
            const pathGif = join(path, `hi7.gif`);

            var mentions = [], nameArray = [], memLength = [], i = 0;

            for (id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id });
                memLength.push(participantIDs.length - i++);

                if (!global.data.allUserID.includes(id)) {
                    await Users.createData(id, { name: userName, data: {} });
                    global.data.userName.set(id, userName);
                    global.data.allUserID.push(id);
                }
            }

            memLength.sort((a, b) => a - b);
            const msgTemplate = threadData.customJoin || " {name} :دخـل حبيب الملايـيـن\n الــى مـجـمـوعـه  【{threadName}】 \n{type} انـا سيكو بـوت الـمـجـمـوعـة 🥂*-*🤝🏻";
            const msg = msgTemplate
                .replace(/\{name}/g, nameArray.join(', '))
                .replace(/\{type}/g, (memLength.length > 1) ? 'các bạn' : '')
                .replace(/\{soThanhVien}/g, memLength.join(', '))
                .replace(/\{threadName}/g, threadName);

            if (existsSync(path)) mkdirSync(path, { recursive: true });

            const formPush = existsSync(pathGif)
                ? { body: msg, attachment: createReadStream(pathGif), mentions }
                : { body: msg, mentions };

            return api.sendMessage(formPush, threadID);
        } catch (e) {
            return console.log(e);
        }
    }
        }
