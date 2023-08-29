import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import fs from 'fs';

const databaseRootPath : string = '/home/aonyxbuddy/db';

export async function GetDatabase(relativePath: string) {
    const databasePath : string = databaseRootPath + relativePath;

    if (!fs.existsSync(databasePath)){
        fs.mkdirSync(databasePath, { recursive: true });
    }

    const db = await open({
        filename: `${databasePath}.db`,
        driver: sqlite3.Database
    })

    return db;
}