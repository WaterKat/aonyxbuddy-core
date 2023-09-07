import { Request, Response, Router } from 'express';
import * as db from '../db.js';
import * as bcrypt from 'bcrypt';

async function DoesUsernameExistSQL(username: string): Promise<boolean | Error> {
    const table_name: string = 'public.users';
    const username_column: string = 'username';
    const query: string = `SELECT EXISTS (SELECT 1 FROM $1 WHERE $2 = $3 ) AS result`;
    const values: string[] = [table_name, username_column, username];
    try {
        const queryPromise = db.GetClient().query(query, values);
        const exists = (await queryPromise).rows[0].result;
        return exists;
    }
    catch (e) {
        return e as Error;
    }
}

async function GetPasswordSQL(username: string): Promise<string | Error> {
    const table: string = 'public.users';
    const username_column: string = 'username'
    const query: string = `SELECT 1 FROM $1 WHERE $2 = $3`;
    const variables: string[] = [table, username_column, username];
    try {
        const queryResult = await db.GetClient().query(query, variables);
        if (queryResult.rowCount < 1) return '';
        return queryResult.rows[0].password;
    } catch (e) {
        return e as Error;
    }
}

async function ValidatePassword(password: string, encryptedPassword: string) : Promise<boolean|Error> {
    return new Promise<boolean | Error> (resolve => {
        bcrypt.compare(password, encryptedPassword, function (err, result) {
        if (err) resolve(err as Error);
        resolve(result);
        });
    });
}

async function GetLoginToken(username: string) : Promise<string | Error> {
    return `{"username":${username}}`;
}

async function Login(req: Request, res: Response) {
    const username: string | undefined = req.body.username;
    const rawPassword: string | undefined = req.body.password;

    //Check that all fields were provided.
    if (!username || !rawPassword) {
        res.statusCode = 400;
        res.send('One or more fields were not provided');
        return;
    }

    //Check if username exists
    const DoesUsernameExistQuery = await DoesUsernameExistSQL(username);
    if (DoesUsernameExistQuery instanceof Error) {
        res.statusCode = 500;
        res.send('There was an error validating your information. Please try again later.');
        return;
    }
    if (!DoesUsernameExistQuery){
        res.statusCode = 404;
        res.send('The username or password were incorrect');
        return;
    }

    //Grab encrypted password from db
    const GetPasswordQuery = await GetPasswordSQL(username);
    if (GetPasswordQuery instanceof Error) {
        res.statusCode = 500;
        res.send('There was an error validating your information. Please try again later.');
        return;
    }
    if (!GetPasswordQuery){
        res.statusCode = 404;
        res.send('The username or password were incorrect');
        return;
    }

    //Validate password
    const ValidatePasswordRequest = await ValidatePassword(rawPassword, GetPasswordQuery);
    if (ValidatePasswordRequest instanceof Error) {
        res.statusCode = 500;
        res.send('There was an error validating your information. Please try again later.');
        return;
    }
    if (!ValidatePasswordRequest) {
        res.statusCode = 404;
        res.send('The username or password were incorrect');
        return;
    }

    //validation successfull
    const GetLoginTokenRequest = await GetLoginToken(username);
    if (GetLoginTokenRequest instanceof Error){
        res.statusCode = 500;
        res.send('There was an error validating your information. Please try again later.');
        return;
    }
    res.set('Authorization', `Bearer ${GetLoginTokenRequest}`);
    res.send(`Your validation was successful. Welcome ${username}!`);
    return;
}

export function LinkRouter(router: Router) {
    const endpoint = '/login';

    router.get(endpoint, function (req, res) {
        res.send(`You've reached the ${endpoint} endpoint.`);
    });
    router.post(endpoint, Login);
}