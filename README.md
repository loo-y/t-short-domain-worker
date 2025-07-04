# Short Domain Worker

A high-performance, scalable short domain service built with Cloudflare Workers, Hono, and Workers KV.

## Features

- **Custom Shortcodes**: Users can provide their own custom shortcodes.
- **Random Shortcodes**: If no custom shortcode is provided, or if the custom shortcode is already taken, a unique 6-character random shortcode is generated.
- **Fast Redirects**: Built on Cloudflare's edge network for lightning-fast redirects.
- **Scalable**: Workers KV provides a scalable and fast storage solution.

## Tech Stack

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Hono](https://hono.dev/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd t-short-domain-worker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create KV Namespaces

This service requires a Cloudflare Workers KV namespace to store the links.

**Create the production namespace:**

```bash
npx wrangler kv namespace create "LINKS"
```

**Create the preview (for local development) namespace:**

```bash
npx wrangler kv namespace create "LINKS" --preview
```

After running these commands, copy the generated `id` and `preview_id` into your `wrangler.json` file:

```json
{
  // ... other configurations
  "kv_namespaces": [
    {
      "binding": "LINKS",
      "id": "your-production-id-here",
      "preview_id": "your-preview-id-here"
    }
  ]
}
```

### 4. Start the Development Server

```bash
npm run dev
```

Your worker will be available at `http://localhost:5173`.

## API Usage

### Create a Short Link

Send a `POST` request to the `/s` endpoint.

**Request Body:**

- `url` (string, required): The original URL to shorten.
- `custom_code` (string, optional): A custom shortcode for the link.

**Example with a custom shortcode:**

```bash
curl -X POST http://localhost:5173/s \
-H "Content-Type: application/json" \
-d '{"url": "https://www.cloudflare.com/", "custom_code": "cf"}'
```

**Example with a random shortcode:**

```bash
curl -X POST http://localhost:5173/s \
-H "Content-Type: application/json" \
-d '{"url": "https://www.cloudflare.com/"}'
```

**Success Response:**

```json
{
  "short_url": "http://localhost:5173/cf"
}
```

### Accessing a Short Link

Simply navigate to the short URL in your browser, and you will be redirected to the original URL.

For example, visiting `http://localhost:5173/cf` will redirect you to `https://www.cloudflare.com/`.

## Deployment

To deploy your worker to Cloudflare's global network, run:

```bash
npm run deploy
```