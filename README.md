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

## Screenshots

Below are example screenshots. Replace these files with real screenshots placed in `public/screenshots/`.

- App home


<img width="1888" height="899" alt="Screenshot 2026-02-22 144129" src="https://github.com/user-attachments/assets/a9f0511f-a394-46bf-8e7c-069c90768454" />




- Listing / detail view

<img width="1878" height="870" alt="Screenshot 2026-02-22 144157" src="https://github.com/user-attachments/assets/7c3c52ab-35d3-4d9f-aaeb-3a2f50f51e68" />




- Listing / detail view

<img width="1878" height="890" alt="Screenshot 2026-02-22 144237" src="https://github.com/user-attachments/assets/74996209-d797-4f14-a8c0-6c7e902aeab7" />




- Listing / detail view

<img width="1868" height="870" alt="Screenshot 2026-02-22 144321" src="https://github.com/user-attachments/assets/47e9e130-9cc6-47e6-ac95-afacc796f71d" />




- Listing / detail view

<img width="1874" height="837" alt="Screenshot 2026-02-22 144406" src="https://github.com/user-attachments/assets/6e8ae9fa-f1ea-4577-9b60-1a402625c5c8" />


## Contributing

Feel free to open issues or PRs. Keep changes focused and add tests where appropriate.

## License

This project is available under the MIT License. See the LICENSE file if present or add one before publishing.
