const BOT_TOKEN = process.env.TG_BOT_TOKEN

function sendTelegramMessage(text, reciever) {
  const url = `http://78.17.104.41:8001/sendTelegramMessage`;
  const data = {
    reciever: reciever,
    text: text,
    botToken: BOT_TOKEN,
  };
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    // .then(data => console.log("Сообщение отправлено:", data))
    .catch(error => console.error("Ошибка отправки:", error));
}

module.exports = sendTelegramMessage