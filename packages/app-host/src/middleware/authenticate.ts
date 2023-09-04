import { Request, Response, NextFunction } from 'express';

const keys = ['this-is-a-code'];

function authorize(req: Request, res: Response, next: NextFunction) {
    const providedToken = req.headers.authorization ?? 'authorization-not-provided';
    if (!providedToken) {
        res.statusCode = 400;
        console.error("Authorization not provided.", req.ip, '>>', req.url);
        res.write("Authorization not provided.");
        res.send();
    } else if (!keys.includes(providedToken.substring('Bearer '.length))) {
        res.statusCode = 401;
        console.error("Authorization was invalid", req.ip, '>>', req.url);
        res.write("Authorization was invalid");
        res.send();
    } else {
        next();
    }
}

export default authorize;