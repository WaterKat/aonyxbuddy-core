import * as db from './db.js';
import { Request, Response, NextFunction } from 'express';


async function authenticate(token: string, custom_token_column?: string): Promise<{ authenticated: boolean, username: string }> {
    const table: string = 'public.auth';
    const token_column: string = custom_token_column ?? 'general';
    const username_selection: string = 'username';
    const query: string = `SELECT ${username_selection} FROM ${table} WHERE ${token_column}='${token}'`;
    const queryResponse = await db.GetClient().query(query);
    return {
        authenticated: (queryResponse.rowCount > 0),
        username: (queryResponse.rowCount > 0) ? queryResponse.rows[0][username_selection] : ''
    };
}

const authenticationTimeoutInSeconds = 10;

export function AuthenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    const providedToken: string | undefined = req.headers.authorization;

    if (!providedToken) {
        const responseText = `Authorization not found. ${req.ip} >> ${req.url}`;
        console.error(responseText);
        res.send(responseText);
        return;
    }

    const authenticationPromise = authenticate(providedToken.substring('Bearer '.length));
    authenticationPromise.catch((error) => { 
        const responseText = `Something went wrong with the authentication. ${req.ip} >> ${req.url}`;
        console.error(responseText, (error as Error).message);
        res.send(responseText);
        return;
    })
    authenticationPromise.then((auth) => {
        if (auth.authenticated) {
            req.headers.username = auth.username;
            return next();
        } else {
            const responseText = `Authorization not valid. ${req.ip} >> ${req.url}`;
            console.error(responseText);
            res.send(responseText);
            return;
        }
    });
    setTimeout(() => {
        const responseText = `Authentication timed out... ${req.ip} >> ${req.url}`;
        console.error(responseText);
        res.send(responseText);
        return;
    }, 1000 * authenticationTimeoutInSeconds);
}

