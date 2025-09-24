// server.js
import express from 'express';
import admin from 'firebase-admin';
import bodyParser from 'body-parser';
import { createRequire } from 'module';

// const require = createRequire(import.meta.url);
const serviceAccount = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key,
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
  universe_domain: process.env.universe_domain,
};
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
