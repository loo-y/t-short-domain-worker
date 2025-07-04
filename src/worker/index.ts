import { Hono } from 'hono';
import { App } from './types';
import { handleShorten } from './handlers/shorten';
import { handleRedirect } from './handlers/redirect';

const app: App = new Hono();

app.post('/s', handleShorten);
app.get('/:short_code', handleRedirect);

export default app;