const cron = require('node-cron');
const pool = require("./mysql");
const pluralizeWord = require("./pluralizeWord")
const sendTelegramMessage = require("./telegram");


function bithdayReminder() {
    pool.query(
        `SELECT *
            FROM member m
            WHERE DATE_FORMAT(m.date_birth, '%m-%d') = DATE_FORMAT(CURDATE(), '%m-%d')
            ORDER BY m.fio ASC;`,
        (error, member_result) => {
            if (error) {
                console.log(error);
                return;
            }
            if (member_result.length === 0) {
                return
            }
            const memberData = member_result.map(item => item.fio).join(', ')
            const memberWord = pluralizeWord(member_result.length, ['участника', 'участников', 'участников'])
            const messageText = `Сегодня День Рождения у ${memberWord}: <b>${memberData.fio}</b>`
            sendTelegramMessage(messageText, '1663445325')
            sendTelegramMessage(messageText, '5004682600')

        }
    );
    console.log(`Задача выполняется... Текущее время: ${now}`);
}

cron.schedule('0 5 * * *', () => {
    bithdayReminder();
});

console.log('Планировщик задач для уведомлений о днях рождениях запущен.');