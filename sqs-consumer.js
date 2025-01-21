import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

const dynamoClient = new DynamoDBClient();

export const handler = async (event) => {
  const putItems = event.Records.map(async (record, i) => {
    const body = JSON.parse(record.body);

    // suggest - TransactionWriteItems (batch items).
    const command = new PutItemCommand({
      TableName: 'payments',
      Item: {
        id: { S: body.orderId },
        message: { S: body.name }
      },
    });

    return dynamoClient.send(command);
  })

  const responses = await Promise.allSettled(putItems);

  const batchItemFailures = []
  let failureIndexes = 0;

  for (const response of responses) {
    if (response.status === 'rejected') {
      batchItemFailures.push({
        itemIdentifier: event.Records[failureIndexes].messageId
      })
    }

    failureIndexes++;
  }


  return {
    batchItemFailures
  };
};
