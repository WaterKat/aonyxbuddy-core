import * as express from 'express';
import bodyParser from 'body-parser';

import config from './config.js';
import * as users from './users/index.js';

const app = express.default();
app.use(bodyParser.urlencoded({ extended: false }));

const usersRouter = express.Router();
users.Login.LinkRouter(usersRouter);
users.CreateUser.LinkRouter(usersRouter);
app.use('/users', usersRouter);

app.listen(config.port, () => {
  console.log(`${config.name} is listening on port ${config.port}...`)
});

//import { AuthenticationMiddleware } from './authenticate.js';

//import { CreateUser } from './users.js';

/*
const defaultRouter = express.Router();
//defaultRouter.use(AuthenticationMiddleware);

defaultRouter.get('/config', (req, res)=> {
  console.log(JSON.stringify({
    url : req.url,
    ip : req.ip,
    username : req.headers.username,
    token : req.headers.authorization
  }));

  res.write('your request was valid');
  res.send();
});

app.post('/api/apps/create-user', CreateUser);

app.use('/api/apps', defaultRouter);
*/


//curl -H "Authorization: Bearer generalfar" http://server-aonyxlimited.local:9002/api/apps/config
