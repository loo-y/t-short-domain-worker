import { Context } from 'hono';
import { generateShortCode } from '../utils';

export async function handleShorten(c: Context<{
    Bindings: {
        LINKS: KVNamespace;
    };
}>) {
	const { url, custom_code, auto_create } = await c.req.json<{ url: string; custom_code?: string; auto_create?: boolean }>();

	if (!url) {
		return c.json({ error: 'URL is required' }, 400);
	}

	let shortCode: string;
	
	console.log(`Received request to shorten URL: ${url}, custom_code: ${custom_code}, auto_create: ${auto_create}`);

	if (custom_code) {
		const existing = await c.env.LINKS.get(custom_code);
		if (existing) {
			if (auto_create) {
				// Custom code is taken, but auto_create is true, so generate a new unique random one
				do {
					shortCode = generateShortCode();
				} while (await c.env.LINKS.get(shortCode));
			} else {
				// Custom code is taken and auto_create is false/undefined, return the existing URL
				const shortUrl = `${c.req.url.replace(c.req.path, '')}/${custom_code}`;
				return c.json({
					message: "Custom code already exists.",
					short_url: shortUrl,
					destination_url: existing
				});
			}
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
