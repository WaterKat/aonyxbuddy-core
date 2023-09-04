import pg from 'pg';

const clientConfig : pg.ClientConfig = {
    user: process.env.SERVER_DB_USER,
    host: process.env.SERVER_DB_HOST,
    database: process.env.SERVER_DB_NAME,
    password: process.env.SERVER_DB_PASSWORD,
    port: 5432,
}

let client : pg.Client;

function connect() {
    client = new pg.Client(clientConfig);
    client.on('error', error => {
        console.error(error);
        connect();
    });
    return client.connect();
                    //^?    
}

export function GetClient() : pg.Client {
    return client;
}

connect();
