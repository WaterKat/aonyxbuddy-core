import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

function server_apps(req: Request, res: Response, next: NextFunction) {
    const localPath: string = `./www${req.path}/app.js`;
    try {
        if (fs.existsSync(localPath)) {
            console.log('App Served:',`${localPath} >> ${req.headers['x-forwarded-for']} as requested from ${req.protocol + '://' + req.hostname + req.originalUrl}`);
            
            res.statusCode = 200;
            res.setHeader("content-type", "text/javascript");
            fs.createReadStream(localPath).pipe(res);
            return;
        }else{
            console.error('App request invalid.', localPath);
        }
    } catch (e) {
        console.error(e);
    }

    next();
}


export default server_apps;