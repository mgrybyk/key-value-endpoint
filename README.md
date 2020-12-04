# key-value-endpoint

> TODO

## Installation and Running

1. `npm install`
2. `npm run build`
3. `npm run start` (don't forget to set the [environment variables](#environment-variables))

## Endpoints

- GET `/v1/store`

### Health Check

- `/health/liveness` - Liveness check
- `/health/readiness` - Readiness check
- `/health` - Combined Health (Readiness and Liveness) checks

## Environment Variables
```
# SERVER
NODE_ENV=production
PORT=3000
```

It's also possible to use [.env](https://www.npmjs.com/package/dotenv) file for development.
