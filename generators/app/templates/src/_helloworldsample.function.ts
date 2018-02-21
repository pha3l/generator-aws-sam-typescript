import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

export const handler: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from your serverless Webpack/Typescript app!',
      input: event,
    }),
  };

  cb(null, response);
}
