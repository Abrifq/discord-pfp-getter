# discord-pfp-getter

Just a small page with a small api.

# Deployment

Set `TOKEN` environment variable to a Discord bot token. Setup a Discord bot at the [developers page](https://discord.com/developer).
This app uses port 8080 by default. If you want to use another port, set `PORT` environment variable.
`node .` will launch the project.

# Usage

## With a Browser

Proceed to /index.html and paste the id to the input box. Then, press Enter and let the profile picture load.

## With a terminal app

Send a `GET` request to `/api/getpfp` with parameter `id` set to the target user's id.
Example: `GET /api/getpfp?id=12345 HTTP/1.1`
