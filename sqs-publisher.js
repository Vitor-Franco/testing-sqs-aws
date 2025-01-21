import {randomUUID} from 'node:crypto';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient();

export const handler = async (event) => {
  
  const orderId = randomUUID();
  const body = JSON.parse(event.body);

  const command = new SendMessageCommand({
    QueueUrl: process.env.SQS_URL,
    MessageBody: JSON.stringify({
      orderId,
      ...body
    })
  });

  await sqsClient.send(command);

  return {
    statusCode: 201,
    body: JSON.stringify({
      orderId,
      message: 'Order created successfully'
    }),
  }
};
