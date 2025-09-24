import axios from 'axios';

const BASE_URL = 'http://192.168.41.159:3000';

export async function sendNotification(
  token: string,
  title: string,
  body: string,
  screen: string,
) {
  try {
    const response = await axios.post(`${BASE_URL}/send`, {
      token,
      title,
      body,
      screen,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    console.error(
      'Error sending notification:',
      error.response?.data || error.message,
    );
    throw error;
  }
}
