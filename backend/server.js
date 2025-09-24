// server.js
import express from 'express';
import admin from 'firebase-admin';
import bodyParser from 'body-parser';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./myinsta-b6255-firebase-adminsdk-fbsvc-9f94feea33.json');

const app = express();
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.get('/', (req, res) => {
  res.send('Notification server running');
});

app.post('/send', async (req, res) => {
  const { token, title, body, screen } = req.body;

  const message = {
    notification: { title, body },
    data: { screen: screen },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).send({ success: true, response });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: error.message });
  }
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));
