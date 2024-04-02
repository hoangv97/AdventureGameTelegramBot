# Adventure Game Telegram Bot

The Adventure Game Telegram Bot is an AI-powered bot that allows you to play a text-based adventure game on Telegram. With this bot, you can unleash your imagination and create your own stories. Each choice you make in the game generates AI-generated images based on your story.

## Technology

The bot is built using the following technologies:

- NextJS
- Flagsmith
- MindsDB
- MySQL
- Replicate

## Installation

Install NPM by running the following command:

```bash
npm install
```

Copy .env.local file from .env.example file

### Set up MindsDB

- Run MySQL server as MindsDB data source

- Create a MySQL table name `chat` with 2 columns: senderId (varchar), messages (long text)

- Run MindsDB local (recommend: using [Docker](https://docs.mindsdb.com/setup/self-hosted/docker)/Docker Desktop)

- Create MySQL data source: [Guide](https://docs.mindsdb.com/integrations/data-integrations/mysql)

- Create MindsDB engines and models

```sql
CREATE ML_ENGINE openai_engine
FROM openai
USING
   api_key = 'YOUR_OPENAI_API_KEY';

CREATE MODEL openai_model
PREDICT answer
USING
    engine = 'openai_engine',
    question_column = 'question',
    context_column = 'context',
    openai_api_key = 'YOUR_OPENAI_API_KEY';

CREATE MODEL replicate_text2img
PREDICT url
USING
    engine = 'replicate',
    model_name= 'stability-ai/sdxl',
    version ='39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    api_key = 'YOUR_REPLICATE_KEY';
```

### Set up Flagsmith

- Create a feature for Generate Image feature flag with feature name: `generate_image`

- Copy Client-side Environment Key to .env.local file

```bash
FLAGSMITH_ENV_KEY=
```

### Set up Replicate

Go to [Replicate](https://replicate.com/explore)

Create Replicate API key and insert to .env.local file

```bash
REPLICATE_API_TOKEN=
```

For generating images for each step, we can use this model: [sdxl](https://replicate.com/stability-ai/sdxl)

### Create a Telegram bot

Create a bot and copy the token to .env.local file

Run the app

```bash
npm run dev
```

Set up webhooks URL (for development, you can use [Ngrok](https://ngrok.com/) to get the public URL)

```bash
TELEGRAM_BOT_TOKEN=
```

## Demo

https://github.com/ngviethoang/AdventureGameTelegramBot/assets/25498258/ccd955a4-ca7c-4809-a194-3cc078b155bb
