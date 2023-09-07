import pg from 'pg';

interface IConfig {
    name: string,
    port: number,
    db: pg.ClientConfig,
    auth: {
        jwt_secret: string
    }
}

const config : IConfig= {
    name: process.env.APP_NAME as string,
    port: +(process.env.APP_PORT as string),
    db: {
        user: process.env.SERVER_DB_USER as string,
        host: process.env.SERVER_DB_HOST as string,
        database: process.env.SERVER_DB_NAME as string,
        password: process.env.SERVER_DB_PASSWORD as string,
        port: +(process.env.SERVER_DB_PORT as string)
    },
    auth: {
        jwt_secret: process.env.JWT_SECRET as string
    }
}

export default config;