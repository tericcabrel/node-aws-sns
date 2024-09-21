import { APIGatewayProxyHandler } from 'aws-lambda';
import { connectToDatabase } from "../utils/db";
import { handleProcessOrder, validateInput } from "../services/orders/process-order";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
  context.callbackWaitsForEmptyEventLoop = false;

  await connectToDatabase();

  const payload = JSON.parse(event.body ?? '{}');

  const validationResult = validateInput(payload);

  if (validationResult.success) {
    const processResult = await handleProcessOrder(validationResult.data);

    if (!processResult.success) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "text/json" },
        body: JSON.stringify(processResult.error),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/json" },
      body: JSON.stringify(processResult.data),
    };
  } else {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/json" },
      // @ts-ignore
      body: JSON.stringify({ message: "Invalid input data", errors: validationResult.error }),
    };
  }
};
