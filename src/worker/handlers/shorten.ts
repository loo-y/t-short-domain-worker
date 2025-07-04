import { Context } from 'hono';
import { generateShortCode } from '../utils';

export async function handleShorten(c: Context<{
    Bindings: {
        LINKS: KVNamespace;
    };
}>) {
	const { url, custom_code } = await c.req.json<{ url: string; custom_code?: string }>();

	if (!url) {
		return c.json({ error: 'URL is required' }, 400);
	}

	let shortCode: string;

	if (custom_code) {
		const existing = await c.env.LINKS.get(custom_code);
		if (existing) {
			// Custom code is taken, generate a new unique random one
			do {
				shortCode = generateShortCode();
			} while (await c.env.LINKS.get(shortCode));
		} else {
			// Custom code is available
			shortCode = custom_code;
		}
	} else {
		// No custom code, generate a new unique random one
		do {
			shortCode = generateShortCode();
		} while (await c.env.LINKS.get(shortCode));
	}

	await c.env.LINKS.put(shortCode, url);

	const shortUrl = `${c.req.url.replace(c.req.path, '')}/${shortCode}`;

	return c.json({ short_url: shortUrl });
}
