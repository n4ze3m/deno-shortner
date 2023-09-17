# Deno Shortner


A simple URL shortner written in Deno. Application is using Deno KV store to store the shortned URL and redirect to the original URL. All the shortned URL will expire after 1 day.


## Usage

```bash
deno run --allow-read --allow-net --unstable .\server.ts
```

This will start the server on port 8000.


## API

### POST /create

Create a new short URL.

```bash
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://www.google.com"}' http://localhost:8000/create
```

### GET /:id

Redirect to the original URL.

```bash
curl -X GET http://localhost:8000/:id
```

## License

MIT