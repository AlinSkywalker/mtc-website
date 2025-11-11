const BOT_TOKEN = process.env.TG_BOT_TOKEN

function sendTelegramMessage(text, reciever) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const data = {
    chat_id: reciever,
    text: text
  };
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => console.log("Сообщение отправлено:", data))
    .catch(error => console.error("Ошибка отправки:", error));
}

module.exports = sendTelegramMessage