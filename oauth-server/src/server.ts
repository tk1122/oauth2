import App from './app';
import { debug, DebugLevel, setDebugLevel } from './utils/debug';
import { config } from 'dotenv';
setDebugLevel(DebugLevel.DEBUG);
config();

App.listen(process.env.PORT, () => {
    debug('Port', process.env.PORT);
});
