const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 3000;

// Сначала включим поддержку JSON в express
app.use(express.json());

app.post('/webhook', async (req, res) => {
    const data = req.body;

    if (data.typeWebhook !== 'incomingMessageReceived') {
        res.status(400).send('Invalid typeWebhook');
        return;
    }

    const imageUrl = data.messageData.fileMessageData.downloadUrl;
    const caption = data.messageData.fileMessageData.caption;

    // Загрузить изображение и сохранить его
    const image = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
    });
    fs.writeFileSync('./image.jpg', image.data);

    // Чтение текущего JSON файла и запись значения caption в него
    const jsonData = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    jsonData.caption = caption;
    fs.writeFileSync('./data.json', JSON.stringify(jsonData));

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Webhook server listening at http://localhost:${port}`);
});
