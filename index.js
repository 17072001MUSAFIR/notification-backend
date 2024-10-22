const express = require('express');
const admin = require('firebase-admin');
const app = express();

// Initialize Firebase Admin with your service account key
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());

// Route to send a notification to a single user
app.post('/send-notification', async (req, res) => {
  const { token, title, body, imageUrl } = req.body;

  if (!token || !title || !body) {
    return res.status(400).send({ message: 'Token, title, and body are required.' });
  }

  // Create the message payload
  const message = {
    token: token, // FCM token for the single device
    notification: {
      title: title,
      body: body,
      imageUrl: imageUrl || 'https://my-cdn.com/app-logo.png',
    },
  };

  try {
    // Send the notification
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.status(200).send({ message: 'Notification sent successfully', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send({ message: 'Error sending notification', error: error.message });
  }
});

app.get('/', (req, res) => {
    res.send('API is working!');
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
