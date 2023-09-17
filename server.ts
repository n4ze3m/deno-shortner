import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const app = new Application();
const router = new Router();
const R_URL = new RegExp(/^(http|https):\/\/[^ "]+$/);
const kv = await Deno.openKv();

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

router.post("/create", async (context) => {
  const data = await context.request.body().value;

  const request_url = context.request.url;

  if (!data?.url) {
    context.response.status = 400;
    context.response.body = { error: "No URL found" };
    return;
  }

  if (!R_URL.test(data.url)) {
    context.response.status = 400;
    context.response.body = { error: "Invalid URL" };
    return;
  }

  const id = nanoid(7);

  const ttl = 60 * 60 * 24;

  await kv.set(["short", id], data.url, {
    expireIn: ttl,
  });
  context.response.body = {
    url: `${request_url.origin}/${id}`,
  };
});

router.get("/:id", async (context) => {
  const id = context.params.id;
  const data = await kv.get(["short", id]);
  if (!data.value) {
    context.response.status = 404;
    context.response.body = { error: "URL not found" };
    return;
  }

  context.response.status = 301;
  context.response.redirect(String(data.value));
});

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
