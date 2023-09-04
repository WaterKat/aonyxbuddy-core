/*

import * as db from './db.js';
import { Request, Response } from 'express';
async function GenerateNewTokens (req : Request, res : Response) {
    const table: string = 'public.auth';
    const token_column: string = custom_token_column ?? 'general';
    const username_selection: string = 'username';
    const query: string = `SELECT ${username_selection} FROM ${table} WHERE ${token_column}='${token}'`;
    const queryResponse = await db.GetClient().query(query);
    return {
        authenticated: (queryResponse.rowCount > 0),
        username: (queryResponse.rowCount > 0) ? queryResponse.rows[0][username_selection] : ''
    };
}*/