import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

function favicon(req : Request, res : Response, next : NextFunction) {
    if (   req.path.endsWith('favicon.ico')) {
        res.setHeader("content-type", "image/x-icon");
        fs.createReadStream("./www/favicon.ico").pipe(res);
    }else{
        next();
    }
}

export default favicon;