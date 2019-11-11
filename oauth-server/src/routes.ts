import { Router } from 'express';
import { oauthController } from './controllers/oauthController';
import { appController } from './controllers/appController';
import { infoController } from './controllers/infoController';
import { secretController } from './controllers/secretController';
import { userController } from './controllers/userController';

const oauthRoutes = Router();
const appRoutes = Router();
const infoRoutes = Router();
const secretRoutes = Router();
const userRoutes = Router();

oauthRoutes.post('/create_oauth_request', oauthController.createOauthRequestHandler);
oauthRoutes.post('/get_access_token', oauthController.getAccessTokenHandler);

userRoutes.post('/create_user', userController.createUserHandler);

appRoutes.post('/create_oauth_app', appController.checkScopeHandler, appController.createOauthAppHandler);
appRoutes.get('/get_oauth_apps', appController.checkScopeHandler, appController.getOAuthAppsHandler);
appRoutes.get('/get_oauth_app', appController.checkScopeHandler, appController.getOAuthAppHandler);

infoRoutes.get('/get_user_info', infoController.checkScopeHandler, infoController.getUserInfoHandler);

secretRoutes.get('/get_secret_info', secretController.checkScopeHandler, secretController.getSecretInfohandler);

export { oauthRoutes, appRoutes, infoRoutes, secretRoutes, userRoutes };
