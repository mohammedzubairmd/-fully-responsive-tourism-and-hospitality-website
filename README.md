# -fully-responsive-tourism-and-hospitality-website

# Tourism & Hospitality Platform

A small Vite + React + TypeScript frontend with a minimal Express server for demoing tourism/hospitality features.

## Tech Stack

- Frontend: React, TypeScript, Vite
- Server: Node.js, Express
- Tooling: ESLint, TypeScript

## Prerequisites

- Node.js >= 18
- npm (or use `pnpm`/`yarn` if preferred)

## Install

Clone the repo and install dependencies:

```bash
npm install
```

## Available Scripts

- `npm run dev` — start the frontend dev server (Vite)
- `npm run server` — start the Express server only
- `npm run dev:full` — run both frontend and server concurrently
- `npm run build` — compile TypeScript and build the frontend
- `npm run preview` — preview the production build

Examples:

```bash
# Frontend only
npm run dev

# Server only
npm run server

# Frontend + server (dev)
npm run dev:full
```

## Project Structure (key files)

- [index.html](index.html)
- [src/App.tsx](src/App.tsx)
- [src/main.tsx](src/main.tsx)
- [src/components](src/components)
- [src/services/api.ts](src/services/api.ts)
- [server/index.js](server/index.js)

## Server / API

The server entry point is [server/index.js](server/index.js). It's a simple Express app used for local development and mock endpoints. To run it standalone use:

```bash
npm run server
```

## Notes

- Concurrent dev uses the `concurrently` package (see `dev:full` script).
- If you change ports or environment settings, update `server/index.js` accordingly.

## Contributing

Feel free to open issues or PRs. Keep changes focused and add tests where appropriate.

## License

This project is available under the MIT License. See the LICENSE file if present or add one before publishing.
