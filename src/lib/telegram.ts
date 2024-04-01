// telegram API wrapper
const API_PREFIX = 'https://api.telegram.org/bot';

const fetchApi = async (url: string, init: any) => {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};

export const sendMessage = async (
  senderId: string,
  message: string,
  reply_markup?: any[]
) => {
  const response = await fetchApi(
    `${API_PREFIX}${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: senderId,
        text: message,
        parse_mode: 'MarkdownV2',
        reply_markup,
      }),
    }
  );
  return response;
};

export const sendPhoto = async (senderId: string, url: string) => {
  const response = await fetchApi(
    `${API_PREFIX}${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: senderId,
        photo: url,
      }),
    }
  );
  return response;
};
