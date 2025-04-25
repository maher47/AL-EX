const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");
const http = require("http");
const axios = require("axios");
const semver = require("semver");
const logger = require("./utils/log");
const express = require('express');
const path = require('path');
const gradient = require('gradient-string');
const chalk = require('chalk');
const CFonts = require('cfonts');
const app = express();
const port = process.env.PORT || 2006;
const moment = require("moment-timezone");

// تهيئة التاريخ والوقت
var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");
var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
if (thu == 'Sunday') thu = '🌞 الأحد';
if (thu == 'Monday') thu = '🌙 الإثنين';
if (thu == 'Tuesday') thu = '🔥 الثلاثاء';
if (thu == 'Wednesday') thu = '💧 الأربعاء';
if (thu == "Thursday") thu = '🌈 الخميس';
if (thu == 'Friday') thu = '🎉 الجمعة';
if (thu == 'Saturday') thu = '⭐ السبت';

// تهيئة خادم Express
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port);

// عرض رسالة البدء بتأثير متدرج اللون
const rainbowText = gradient('cyan', 'yellow')(`\nㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ『=== ✨ SAIKO BOT LAUNCH 🌟 ===』\n\n`);
console.log(rainbowText);
logger(chalk.cyanBright("🎉 Your version is sparkling fresh!") + chalk.yellow(" ✨"), "UPDATE");

function startBot(message) {
    (message) ? logger(chalk.magentaBright(message) + chalk.yellow(" 🌟"), "🚀 SAIKO POWER-UP") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "main.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", async (codeExit) => {
        var x = 'codeExit'.replace('codeExit', codeExit);
        if (codeExit == 1) return startBot(chalk.redBright("🔄 SAIKO IS REBOOTING!!!") + chalk.green(" ⚡"));
        else if (x.indexOf(2) == 0) {
            await new Promise(resolve => setTimeout(resolve, parseInt(x.replace(2,'')) * 1000));
            startBot(chalk.cyan("🌈 SAIKO is back online! Hang tight!") + chalk.magenta(" 💖"));
        }
        else return; 
    });

    child.on("error", function (error) {
        logger(chalk.red("⚠️ Oops! Something broke: ") + JSON.stringify(error) + chalk.yellow(" 😿"), "[ Starting ]");
    });
};

// التحقق من التحديثات
axios.get("https://raw.githubusercontent.com/tandung1/Bot12/main/package.json").then((res) => {
    // يمكنك تفعيل هذه الأسطر إذا كنت بحاجة إليها
    // logger(res['data']['name'], "[ PROJECT NAME ]");
    // logger("Version: " + res['data']['version'], "[ VERSION ]");
    // logger(res['data']['description'], "[ NOTE ]");
});

// بدء التشغيل مع تأثيرات مرئية
setTimeout(async function () {
    CFonts.say('SAIKO', {
        font: 'block',
        align: 'center',
        gradient: ['cyan', 'yellow'],
        letterSpacing: 3,
        space: false
    });
    CFonts.say(`Bot Messenger Powered By SAIKO 🚀`, {
        font: 'console',
        align: 'center',
        gradient: ['purple', 'pink'],
        transitionGradient: true
    });
    CFonts.say(`Crafted with 🌟 LOVE 🌟 & 🎨 COLORS`, {
        font: 'simple',
        align: 'center',
        gradient: ['red', 'blue'],
        letterSpacing: 2
    });
    console.log(chalk.bgMagentaBright.white.bold(`\n 🎉 SAIKO BOT READY AT ${gio} 🎉 \n`));

    console.log(rainbowText); // إعادة عرض النص المتدرج

    logger(chalk.blueBright('🌌 Loading SAIKO magic code') + chalk.greenBright(' ✨'), 'LOAD');
    startBot(chalk.cyanBright("🚀 Launching SAIKO now!") + chalk.yellow(" 🌟"));
}, 70);