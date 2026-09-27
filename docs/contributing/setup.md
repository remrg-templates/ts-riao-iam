# Setup Guide

## Install dev tools

- node

## Install node modules

- `npm i`

## Environment Variables

See `src/env.ts` to see how to use this project's environment variables.

### Create .env file

Copy the `.env.example` file to `.env` and update the values as needed.

```bash
cp .env.example .env
```

## Build

- `npm run build`
- `npm start`

## Development

- `npm run dev`
- View the [Development Guide](./development.md)

### Docker

You can quickly start the required setup leveraging Docker Compose:

```bash
docker compose up --build -d
```
