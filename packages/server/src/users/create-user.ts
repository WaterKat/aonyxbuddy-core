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

async function DoesEmailExistSQL(email: string): Promise<boolean | Error> {
    const table_name: string = 'public.users';
    const email_column: string = 'email';
    const query: string = `SELECT EXISTS (SELECT 1 FROM $1 WHERE $2 = $3 ) AS result`;
    const values: string[] = [table_name, email_column, email];
    try {
        const queryPromise = db.GetClient().query(query, values);
        const exists = (await queryPromise).rows[0].result;
        return exists;
    }
    catch (e) {
        return e as Error;
    }
}

async function SaltPasswordBCrypt(password: string): Promise<string | Error> {
    const saltRounds: number = 12;
    return new Promise<string | Error>((resolve) => {
        bcrypt.hash(password, saltRounds, function (e: Error | undefined, hash: string) {
            if (e) {
                resolve(e);
            } else {
                resolve(hash);
            }
        });
    });
}

async function CreateUserSQL(email: string, username: string, password: string) : Promise<boolean | Error> {
    const table_name: string = 'public.users';
    const table_columns : string[] = ['email', 'username', 'password'];
    const query: string = `INSERT INTO $1 ($2, $3, $4) VALUES ($5, $6, $7)`
    const values: string[] = [table_name, ...table_columns, email, username, password];
    try {
        await db.GetClient().query(query, values);
        return true;
    }
    catch (e) {
        return e as Error;
    }
}

async function CreateUser(req: Request, res: Response) {
    const email: string | undefined = req.body.email as (string | undefined);
    const username: string | undefined = req.body.username as (string | undefined);
    const rawPassword: string | undefined = req.body.password as (string | undefined);

    //Check that all fields were provided.
    if (!email || !username || !rawPassword) {
        res.statusCode = 400;
        res.send('One or more fields were not provided');
        return;
    }

    //Validate email
    /* Check for email string requirements */
    if (!email.includes('@') || email.length < 3) {
        res.statusCode = 400;
        res.send('Invalid email.');
        return;
    }
    /* Check if email is available for creation */
    const DoesEmailExistQuery = await DoesEmailExistSQL(email);
    if (DoesEmailExistQuery instanceof Error) {
        res.statusCode = 500;
        res.send('There was an error validating your information. Please try again later.');
        return;
    }
    if (DoesEmailExistQuery) {
        res.statusCode = 409;
        res.send('This email is already taken.');
        return;
    }

    //Validate username
    /* Check for username string requirements*/
    if (username.length < 8) {
        res.statusCode = 400;
        res.send('Invalid username.');
        return;
    }
    /* Check if username is available for creation */
    const DoesUsernameExistQuery = await DoesUsernameExistSQL(username);
    if (DoesUsernameExistQuery instanceof Error) {
        res.statusCode = 500;
        res.send('There was an error validating your information. Please try again later.');
        return;
    }
    if (DoesUsernameExistQuery) {
        res.statusCode = 409;
        res.send('This username is already taken.');
        return;
    }

    //Validate password / salt password
    const SaltPasswordRequest = await SaltPasswordBCrypt(rawPassword);
    if (SaltPasswordRequest instanceof Error){
        res.statusCode = 500;
        res.send('There was an error processing your information.');
        return;
    }
    const password : string = SaltPasswordRequest;

    //Create user
    const CreateUserQuery = await CreateUserSQL(email, username, password);
    if (CreateUserQuery instanceof Error) {
        res.statusCode = 500;
        res.send('There was an error creating the user.');
        return;
    }

    //User created
    res.statusCode = 200;
    res.send('Your user information was successfully created.');
    return;
}

export function LinkRouter(router: Router) {
    const endpoint = '/create-user';

    router.get(endpoint, function (req, res) {
        res.send(`You've reached the ${endpoint} endpoint.`);
    });
    router.post(endpoint, CreateUser);
}