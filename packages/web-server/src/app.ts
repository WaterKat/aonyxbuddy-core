import * as express from 'express';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express.default();

const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));


/*
app.get('/', function (req, res) {
    res.send('Hello world!');
});
*/

app.listen(port, () => {
    console.log(`Listening for connections on port ${port}`);
});