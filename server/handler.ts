import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import {createConnection, getConnectionManager} from "typeorm";

export async function createDB() {
  try {
    const connection  = await  createConnection({
      type: "postgres",
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      // entities: [
      //   User,
      // ],
      // entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: true,
      logging: false
    });
    return connection;
  } catch (err) {
    // If AlreadyHasActiveConnectionError occurs, return already existing connection
    if (err.name === "AlreadyHasActiveConnectionError") {
      const existingConnection = getConnectionManager().get("default");
      console.log('Using existing connection. Connected: ', existingConnection.isConnected);
      console.log('Using existing connection. Connected: ', existingConnection.entityMetadatas);

      return existingConnection;
    } else {
      throw err;
    }
  }
}

export const hello3: APIGatewayProxyHandler = async (event, _context) => {

  console.log('starting');

  const connection = await createDB();
  console.log(connection);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hi:' + process.env.TWITTER_ACCESS_TOKEN + '. Ho:' + process.env.TWITTER_ACCESS_TOKEN2 + '. Go Serverless Webpack (Typescript) v10.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  };
}