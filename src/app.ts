import express from 'express';
import routes from './api/routes';
import Logger from './logger/Logger';

const app = express();

app.use(express.json());
app.use('/', routes);

export default app;