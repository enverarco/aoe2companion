import "reflect-metadata";

import 'source-map-support/register';
import {createConnection, getConnectionManager} from "typeorm";

require('dotenv').config();

// Use pg2 to force inclusion in final package
import * as pg2 from 'pg';
import {KeyValue} from "../../serverless/entity/keyvalue";
import {LeaderboardRow} from "../../serverless/entity/leaderboard-row";
import {User} from "../../serverless/entity/user";

console.log(pg2 != null ? 'pg initialized' : '');

export async function createDB() {
    try {
        const connection = await createConnection({
            type: "postgres",
            url: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
            entities: [
                KeyValue,
                User,
                LeaderboardRow,
            ],
            // entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
            synchronize: true,
            logging: false,//!!process.env.IS_OFFLINE,
        });
        console.log('Using NEW connection. Connected: ', connection.isConnected);
        return connection;
    } catch (err) {
        // If AlreadyHasActiveConnectionError occurs, return already existing connection
        if (err.name === "AlreadyHasActiveConnectionError") {
            const existingConnection = getConnectionManager().get("default");
            // console.log('Using existing connection. Connected: ', existingConnection.isConnected);
            // console.log('Using existing connection. Connected: ', existingConnection.entityMetadatas);
            return existingConnection;
        } else {
            throw err;
        }
    }
}
