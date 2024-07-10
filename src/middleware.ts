import { defineMiddleware, sequence } from "astro:middleware";

const updateViews = defineMiddleware(async ({ url, params }, next) => {
  console.log("running");
  // if (import.meta.env.ASTRO_MODE === "build") {
  //   return next();
  // }

  // if (url.pathname.startsWith("/blog") && params.slug) {
  //   await fetch(url.origin + `/api/views/${params.slug}`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({}),
  //   });
  // }

  return next();
});

export const onRequest = sequence(updateViews);
