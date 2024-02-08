import { defineMiddleware, sequence } from "astro:middleware";

const updateViews = defineMiddleware(async ({ url, params }, next) => {
  if (process.env.ASTRO_BUILD_MODE) {
    return next();
  }

  if (url.pathname.startsWith("/blog") && params.slug) {
    await fetch(url.origin + `/api/views/${params.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
  }

  return next();
});

export const onRequest = sequence(updateViews);
