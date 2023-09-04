import pg from 'pg';

interface IConfig {
    name: string,
    port: number,
    db: pg.ClientConfig
}

const port = process.env.APP_PORT;
let processedPort : number = 3000;
if (typeof port !== 'undefined'){
    if (!isNaN(+port)){
        processedPort = +port;
    }
}

const dbPort = process.env.SERVER_DB_PORT;
let processedDBPort : number = 5432;
if (typeof dbPort !== 'undefined'){
    if (!isNaN(+dbPort)){
        processedDBPort = +dbPort;
    }
}

const config : IConfig= {
    name: process.env.APP_NAME || 'App',
    port: processedPort,
    db: {
        user: process.env.SERVER_DB_USER,
        host: process.env.SERVER_DB_HOST,
        database: process.env.SERVER_DB_NAME,
        password: process.env.SERVER_DB_PASSWORD,
        port: processedDBPort
    }
}

export default config;