import { Context } from 'hono';

export async function handleRedirect(c: Context<{
    Bindings: {
        LINKS: KVNamespace;
    };
}>) {
	const shortCode = c.req.param('short_code');
	const url = await c.env.LINKS.get(shortCode);

	if (url) {
		return c.redirect(url, 302);
	} else {
		return c.json({ error: 'Not Found' }, 404);
	}
}
