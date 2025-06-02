const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
	name: "اوامر",
	version: "1.0.3",
	hasPermssion: 0,
	credits: "انس + SEIKO",
	description: "قائمة الاوامر + صورة عشوائية",
	commandCategory: "نضام",
	usages: "[Name module]",
	cooldowns: 5,
	envConfig: {
		autoUnsend: false,  // تعطيل حذف الرسائل التلقائي
		delayUnsend: 20
	}
};

module.exports.languages = {
	"en": {
		"moduleInfo": "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\n» Module code by %7 «",
		"helpList": '[ There are %1 commands on this bot, Use: "%2help nameCommand" to know how to use! ]',
		"user": "User",
		"adminGroup": "Admin group",
		"adminBot": "Admin bot"
	}
};

async function downloadImage(url, filename) {
	const filepath = path.join(__dirname, "cache", filename);
	await fs.ensureDir(path.join(__dirname, "cache"));
	const response = await axios({
		url,
		responseType: "stream"
	});
	return new Promise((resolve, reject) => {
		const writer = fs.createWriteStream(filepath);
		response.data.pipe(writer);
		writer.on("finish", () => resolve(filepath));
		writer.on("error", reject);
	});
}

const imageLinks = [
	"https://files.catbox.moe/itylin.jpg",
	"https://files.catbox.moe/z871c3.jpg",
	"https://files.catbox.moe/1x1tw9.jpg",
	"https://files.catbox.moe/27k9rl.jpg"
];

let unusedImages = [...imageLinks];

function getRandomImage() {
	if (unusedImages.length === 0) {
		unusedImages = [...imageLinks];
	}
	const index = Math.floor(Math.random() * unusedImages.length);
	const image = unusedImages[index];
	unusedImages.splice(index, 1);
	return image;
}

module.exports.run = async function ({ api, event, args, getText }) {
	const { commands } = global.client;
	const { threadID, messageID } = event;
	const command = commands.get((args[0] || "").toLowerCase());
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

	if (!command) {
		const arrayInfo = [];
		const page = parseInt(args[0]) || 1;
		const numberOfOnePage = 100;
		let msg = "『 ✨ قائمة الأوامر - SEIKO ✨ 』\n\n";

		for (const [name] of commands) arrayInfo.push(name);
		arrayInfo.sort((a, b) => a.localeCompare(b));
		const startSlice = numberOfOnePage * page - numberOfOnePage;
		const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);
		for (const item of returnArray) msg += `📁 ➪ ${item}\n`;

		const text = `\n⌛ عدد الأوامر: ${arrayInfo.length}\n👨‍💻 المطور: SEIKO DEV\n\n𝕋𝕐ℙ𝔼: °${prefix}ℍ𝔼𝕃ℙ°\nصــفـــحــة: (${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)})`;

		try {
			const randomURL = getRandomImage();
			const imgPath = await downloadImage(randomURL, `random_command_${Date.now()}.jpg`);
			return api.sendMessage({
				body: msg + text,
				attachment: fs.createReadStream(imgPath)
			}, threadID);
		} catch (e) {
			console.error("❌ فشل تحميل الصورة:", e);
			return api.sendMessage(msg + text, threadID, messageID);
		}
	}

	return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description,
		`${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
		command.config.commandCategory, command.config.cooldowns,
		((command.config.hasPermssion == 0) ? getText("user") :
			(command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")),
		command.config.credits), threadID, messageID);
};
