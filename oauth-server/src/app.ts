import express, { json, urlencoded, Express } from 'express';
import { appRoutes, infoRoutes, oauthRoutes, secretRoutes, userRoutes } from './routes';
import errorHandler from './utils/errorHandler';
import { createConnection, getConnectionManager } from 'typeorm';
import { OAuthApp } from './models/schema/OAuthApp';
import { debug } from './utils/debug';
import { OAuthRequest } from './models/schema/OAuthRequest';
import tokenResolver from './utils/tokenResolver';
import { RefreshToken } from './models/schema/RefreshToken';
import { User } from './models/schema/User';
import cors from 'cors';

const App: Express = express();
App.use(json());
App.use(urlencoded({ extended: true }));
App.use(cors());

createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'oauth2',
    synchronize: true,
    entities: [OAuthApp, OAuthRequest, RefreshToken, User]
})
    .then(() => {
        getConnectionManager().connections.forEach(c => {
            debug('connection name', c.name);
        });
    })
    .catch(err => {
        debug('connection error', err.toString());
    });

App.use('/admin/user', userRoutes);
App.use('/oauth', oauthRoutes);

App.use('/api', tokenResolver);
App.use('/api/app', appRoutes);
App.use('/api/info', infoRoutes);
App.use('/api/secret', secretRoutes);
App.use(errorHandler);

export default App;
