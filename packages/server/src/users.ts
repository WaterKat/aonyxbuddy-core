import { Request, Response, Router } from 'express';
import * as db from './db.js';
import * as bcrypt from 'bcrypt';

async function SQL_REQ_GetPassword(username: string) : Promise<string | Error> {
    const table : string = 'public.users';
    const username_column: string = 'username'

    const query : string = `SELECT 1 FROM $1 WHERE $2 = $3`;
    const variables : string[] = [table, username_column, username];

    try {
        const queryResult = await db.GetClient().query(query, variables);
        if (queryResult.rowCount < 1) return new Error('No results found for given username');
        return queryResult.rows[0].password;
    } catch (e) {
        return e as Error;
    }
}

async function SQLREQ_CanCreateUsername(username: string): Promise<boolean | Error> {
    const table_name: string = 'public.users';
    const username_column: string = 'username';
    const query: string = `SELECT EXISTS (SELECT 1 FROM $1 WHERE $2 = $3 ) AS result`;
    const values: string[] = [table_name, username_column, username];
    try {
        const queryPromise = db.GetClient().query(query, values);
        const exists = (await queryPromise).rows[0].result;
        return exists ? new Error('This username was already taken.') : true;
    }
    catch (e) {
        return e as Error;
    }
}

async function SQLREQ_CreateUser(username: string, saltedPassword: string): Promise<boolean | Error> {
    const table_name: string = 'public.users';
    const username_column: string = 'username';
    const password_column: string = 'password';
    const query = `INSERT INTO $1 ($2, $3) VALUES ($4, $5);`;
    const values: string[] = [table_name, username_column, password_column, username, saltedPassword];
    try {
        await db.GetClient().query(query, values);
        return true;
    }
    catch (e) {
        return e as Error;
    }
}

async function SaltPassword(rawPassword: string): Promise<string | Error> {
    const saltRounds: number = 12;

    return new Promise<(string | Error)>((resolve) => {
        bcrypt.hash(rawPassword.substring('Bearer '.length), saltRounds, function (e: Error | undefined, hash: string) {
            if (e) {
                resolve(e);
            } else {
                resolve(hash);
            }
        });
    });
}

async function CreateUserWithRawPassword(username: string, rawPassword: string): Promise<boolean | Error> {
    try {
        const usernameValid = await SQLREQ_CanCreateUsername(username);
        if (usernameValid instanceof Error) {
            return usernameValid as Error;
        }
        const password = await SaltPassword(rawPassword);
        if (password instanceof Error) {
            return password as Error;
        }
        if (usernameValid) {
            return await SQLREQ_CreateUser(username, password);
        } else {
            return new Error('How?');
        }
    } catch (e) {
        return e as Error;
    }
}


export function CreateUser(req: Request, res: Response) {
    if (req.body.username && req.body.password) {
        CreateUserWithRawPassword(req.body.username, req.body.password).then(sqlresponse => {
            if (sqlresponse instanceof Error) {
                console.info(sqlresponse);
                res.send('There was an error');
            } else {
                res.send('Good job it worked');
            }
        });
    }
}

async function GetLoginToken(username : string){
    return `{"username":${username}}`;
}

async function Login(req: Request, res: Response) {
    if (req.body.username && req.body.password) {
        try {
            const passwordResult : string | Error = await SQL_REQ_GetPassword(req.body.username);
            if (passwordResult instanceof Error) {
                console.info(passwordResult.message);
                res.send('Password was invalid');
                return;
            }
            bcrypt.compare(req.body.password, passwordResult, function(err, result) {
                if (result) {
                    console.log('Valid login attampt has been logged', GetLoginToken(req.body.username));
                    res.send(GetLoginToken(req.body.username));
                    return;
                }else{
                    res.send('Password was not valid.');
                    console.log('Invalid password login attempt');
                    return;
                }
            });
            res.send('How?');
            return;
        } catch (e) {
            console.info((e as Error).message);
            res.statusCode = 400;
            res.send('Login failure');
        }
    }else{
        console.info('Invalid login request from', req.ip);
        res.send('Invalid login request. Missing fields.');
    }
} 

export function LinkRouter(router: Router) {
    router.get('/login', function (req, res) {
        const ip : string = req.headers['x-real-ip'] as string;
        console.info('Login GET request from', ip);
        res.send("You've reached the login endpoint");
        return;
    });
    router.post('/login', Login);
}
