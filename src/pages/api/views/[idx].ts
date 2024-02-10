import type { APIRoute } from "astro";
import { db } from "../../../lib/firebase";

export const POST: APIRoute = async ({ params }) => {
  if (!params.idx) {
    return new Response("Missing id", {
      status: 400,
    });
  }

  const ref = db.ref("views").child(params.idx);

  const { snapshot } = await ref.transaction((current: number) => {
    if (current === null) {
      return 1;
    }
    return current + 1;
  });

  return new Response(JSON.stringify({ views: snapshot.val() }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const GET: APIRoute = async ({ params }) => {
  if (!params.idx) {
    return new Response("Missing id", {
      status: 400,
    });
  }

  const snapshot = await db.ref("views").child(params.idx).once("value");

  return new Response(JSON.stringify({ views: snapshot.val() }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
