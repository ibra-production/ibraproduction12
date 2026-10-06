const ID_CARD_WORKER_URL = "https://yellow-bar-9020ibra-id-card-upload.bahibarhouma15.workers.dev";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Max-Age": "86400",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders,
    },
  });
}

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { status: 204, headers: corsHeaders });

export const onRequestGet: PagesFunction = async ({ request }) => {
  try {
    const auth = request.headers.get("Authorization");
    if (!auth || !/^Bearer\s+\S+$/i.test(auth)) {
      return json({ error: "Unauthorized" }, 401);
    }

    const incoming = new URL(request.url);
    const key = String(incoming.searchParams.get("key") || "").trim();

    if (!key || key.length > 500 || !/^[A-Za-z0-9._/=-]+$/.test(key)) {
      return json({ error: "Invalid ID card key" }, 400);
    }

    const upstreamUrl = new URL(ID_CARD_WORKER_URL);
    upstreamUrl.searchParams.set("key", key);

    const upstream = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: auth,
        Accept: "image/*,application/pdf,application/octet-stream",
      },
    });

    const headers = new Headers();
    const contentType = upstream.headers.get("Content-Type");
    const contentLength = upstream.headers.get("Content-Length");
    if (contentType) headers.set("Content-Type", contentType);
    if (contentLength) headers.set("Content-Length", contentLength);

    headers.set("Cache-Control", "private, no-store, max-age=0");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Content-Disposition", "inline");
    headers.set("Referrer-Policy", "no-referrer");

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      let detail = text;
      try {
        const parsed = JSON.parse(text);
        detail = parsed?.error || parsed?.message || text;
      } catch {
        // Keep upstream plain-text error.
      }
      return new Response(JSON.stringify({ error: detail || "ID card request failed" }), {
        status: upstream.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          ...corsHeaders,
        },
      });
    }

    return new Response(upstream.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("ID card proxy error:", error);
    return json({ error: "تعذر الوصول إلى بطاقة التعريف." }, 502);
  }
};
