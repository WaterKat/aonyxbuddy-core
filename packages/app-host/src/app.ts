import express from 'express';
import cors from 'cors';

import favicon from './middleware/favicon.js';
import authorize from './middleware/authenticate.js';
import config from './config.js';
import server_apps from './middleware/server-apps.js';

const app = express();
app.use(favicon);

const defaultRouter = express.Router();

defaultRouter.use(authorize);
defaultRouter.use(server_apps);

/*
const whitelist: string[] = ['https://aonyxlimited.com', 'https://streamelements.com'];
const whitelistedIPS: string[] = ['http://10.0.0.'];

defaultRouter.use(cors<cors.CorsRequest>({
    origin: function (origin: string | undefined, callback) {
        if ((whitelist.indexOf(origin ?? '') !== -1) ||
            (whitelistedIPS.some(ip => origin?.startsWith(ip)))) {
            console.log(`Request from ${origin} was passed.`);
            callback(null, true)
        } else {
            console.error(`Request from ${origin} was blocked due to CORS`);
            callback(new Error('Not allowed by CORS'))
        }
    }
}));
*/
app.use(cors({
    origin(requestOrigin, callback) {
        console.log('RO: ', requestOrigin);
        callback(null, true);
    },
}));

defaultRouter.get('/*', function (req, res) {
    console.log(req.path);
    res.statusCode = 418;
    res.write(`<h1>I'm a little teapot!</h1>`);
    res.send();
});

app.use('/api/apps', defaultRouter);

app.listen(config.port, function () {
    console.log(`Listening on port ${config.port}`);
});