
import express, {Router} from 'express';
import Pino from 'pino';
import path from 'path';
import randomJoke from './routes/randomJoke';
import ready from './routes/ready';

const app = express();
const pino = Pino();

const PORT = process.env.PORT || '6088';

if (process.env.NODE_ENV === 'development') {
    const devMiddleware = require('./middleware/devMiddleware').default;
    app.use(devMiddleware);
}

const api = Router();
api.get('/randomJoke', randomJoke);
api.get('/ready', ready);
app.use('/api', api);

app.use('/public', express.static(path.resolve(__dirname, '../../dist/frontend')));

// Expose metadata for Mashroom Portal
app.use('/mashroom.json', express.static(path.resolve(__dirname, '..', '..', 'mashroom.json')));
app.use('/package.json', express.static(path.resolve(__dirname, '..', '..', 'package.json')));

const server = app.listen(PORT, () => {
    pino.info('App is running at http://localhost:%s/public', PORT);
});

if (process.env.NODE_ENV !== 'development') {
// When we receive a SIGTERM by K8S continue to accept connections for 10sec until all network rules are updated
    process.on('SIGTERM', () => {
        pino.info(`Received SIGTERM, waiting 10sec until shutdown`);
        setTimeout(() => {
            server.close(() => {
                pino.info('Server closed, exit');
                process.exit(0);
            });
        }, 10 * 1000);
    });
}
