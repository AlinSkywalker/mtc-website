const cron = require('node-cron');
const pool = require("./mysql");
const pluralizeWord = require("./pluralizeWord")
const sendTelegramMessage = require("./telegram");
const bithdayReminder = require('./bithdayReminder')

cron.schedule('0 5 * * *', () => {
    bithdayReminder();
});

console.log('Планировщик задач для уведомлений о днях рождениях запущен.');