import pg from 'pg';
import config from './config.js';

let client : pg.Client;

function connect() {
    client = new pg.Client(config.db);
    client.on('error', error => {
        console.error(error);
        connect();
    });
    return client.connect();
                    //^?    
}

connect();

export function GetClient() : pg.Client {
    return client;
}

