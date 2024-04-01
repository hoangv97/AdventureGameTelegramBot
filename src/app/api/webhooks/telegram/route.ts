import { sendPhoto, sendMessage } from '@/lib/telegram';
import { NextResponse, NextRequest } from 'next/server';

// webhook event handler
export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(JSON.stringify(body, null, 2));

  // send back a response// extract sender's ID
  const senderId = body.message.from.id;

  // // extract the message
  const message = body.message.text;
  // console.log('message', message);

  await sendMessage(senderId, 'Hello, this is a _response_ from your *Bot*');
  await sendPhoto(senderId, 'https://source.unsplash.com/random');

  return NextResponse.json({ message: 'Hello World' }, { status: 200 });
}
