import MindsDB from 'mindsdb-js-sdk';
import { sendPhoto, sendMessage } from '@/lib/telegram';
import Replicate from 'replicate';
import Flagsmith from 'flagsmith-nodejs/build/sdk';

const replicate = new Replicate();

const flagsmith = new Flagsmith({
  environmentKey: process.env.FLAGSMITH_ENV_KEY || '',
});

const getChatMessages = async (senderId: string) => {
  const query = `SELECT * FROM mysql.chat WHERE senderId = '${senderId}'`;
  const result = await MindsDB.SQL.runQuery(query);
  return result.rows.length > 0 ? result.rows[0].messages.split('\n') : [];
};

const saveChatMessage = async (senderId: string, message: string) => {
  const query = `INSERT INTO mysql.chat (senderId, messages) VALUES ('${senderId}', '${message}')`;
  await MindsDB.SQL.runQuery(query);
};

const generateImage = async (senderId: string, message: string) => {
  // const prompt = message;
  // const query = `SELECT * FROM replicate_text2img WHERE prompt = '${prompt}'`;
  // const result = await MindsDB.SQL.runQuery(query);
  // console.log(result);
  // const image = result.rows[0].url;
  const input = {
    width: 768,
    height: 768,
    prompt: message,
    refine: 'expert_ensemble_refiner',
    apply_watermark: false,
    num_inference_steps: 25,
  };

  const output: any = await replicate.run(
    'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    { input }
  );
  console.log(output);
  await sendPhoto(senderId, output[0]);
};

export const handleMessage = async (senderId: string, message: string) => {
  try {
    await MindsDB.connect({
      host: 'http://127.0.0.1:47334',
      user: '',
      password: '',
    });
    // Get old messages from database
    let chatMessages = [];
    if (message !== '/start') {
      chatMessages = await getChatMessages(senderId);
    }

    let question = '';
    const context = `I want you to act as if you are a classic text adventure game and we are playing. I do not want you to ever break out of your character, and you must not refer to yourself in any way. If I want to give you instructions outside the context of the game, I will use curly brackets {like this} but otherwise you are to stick to being the text adventure program. In this game, the setting is a fantasy adventure world. Each room should have at least 3 sentence descriptions.`;
    // Check if the question has been asked before
    if (message === '/start') {
      question =
        'Start by displaying the first room at the beginning of the game, and wait for my to give you my first command.';
    } else {
      question = `Here is the game history:\n${chatMessages.join(
        '\n'
      )}\n${message}. What will happen next?`;
    }
    const query = `SELECT * FROM openai_model WHERE question = '${question}' AND context = '${context}';`;
    const result = await MindsDB.SQL.runQuery(query);

    const response = result.rows[0].answer;

    // Save the new message to database
    await saveChatMessage(
      senderId,
      [chatMessages, message, response].join('\n')
    );

    await sendMessage(senderId, response);

    const flags = await flagsmith.getEnvironmentFlags();
    const generateImageFeature = flags.isFeatureEnabled('generate_image');
    // console.log('generateImageFeature', generateImageFeature);

    if (generateImageFeature) {
      await generateImage(senderId, response);
    }
  } catch (error) {
    // Failed to connect to local instance
    console.log(error);
  }
};
