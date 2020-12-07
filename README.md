# key-value-endpoint

<!-- [START badges] -->
[![Build Status](https://github.com/mgrybyk/key-value-endpoint/workflows/Test/badge.svg?branch=master)](https://github.com/mgrybyk/key-value-endpoint/actions?query=workflow%3ATest)
<!-- [END badges] -->

## Try it

The server is deployed to `https://ip148.ip-51-81-140.us/key-value/`.  
Example: 
- GET https://ip148.ip-51-81-140.us/key-value/v1/store/foo
- WS `wss://ip148.ip-51-81-140.us/key-value/ws`, [payload](#Add-or-Update-value)

## Setup

### Setup MongoDB

The easiest way is to run `docker-compose` by executing `docker-compose up` command. Db data is stored in `persist` folder.

However, it's possible to use existing MongoDB instance. Set MongoDB host/port properly in [environment variables](#environment-variables).

### Installation and Running

1. `npm install`
2. `npm run build`
3. `npm run start` (don't forget to set the [environment variables](#environment-variables))

## Rest API

- GET `/v1/store/:key` get value by key

## Websocket API

path: `/ws`

### Add or Update Value

Call

```json
{
    "id": "some-id",
    "method": "set-value",
    "params": { "key": "foo", "value": "bar" }
}
```

Response

```json
{
  "success": true,
  "id": "some-id",
  "method": "set-value"
}
```

## Tests

- `npm run test:unit` - unit tests only
- `npm run test:integration` - integration tests only. Requires db connection!
- `npm run test` - run all tests

## Health Check

- `/health/liveness` - Liveness check
- `/health/readiness` - Readiness check
- `/health` - Combined Health (Readiness and Liveness) checks

## Environment Variables
```
NODE_ENV=development
PORT=3000
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_NAME=key-value-store
```

It's also possible to use [.env](https://www.npmjs.com/package/dotenv) file for development.

## Notes

Lots of decisions were made based on assumptions I had.  
Feel free to raise an issue or ping me if you'd like to request any changes!

Thank you!
