// app/api/riona/[...path]/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND = process.env.RIONA_BACKEND || "http://localhost:3099";

// Limita a endpoint noti per sicurezza (puoi ampliare in base al backend)
const ALLOW = [
  "/health",
  "/status",
  "/api/status",
  "/api/login",
  "/api/logout", 
  "/api/me",
  "/api/interact",
  "/api/dm",
  "/api/dm-file",
  "/api/scrape-followers",
  "/api/clear-cookies",
  "/api/exit",
  "/api/characters",
  "/characters",
  /^\/characters\/[^/]+$/,
  "/characters/select",
  "/instagram/login",
  "/instagram/post",
  "/instagram/like",
  "/instagram/comment",
  "/logs/stream",
  "/api/logs/stream",
  "/settings",
  "/api/settings"
];

function isAllowed(path) {
  return ALLOW.some((p) => (typeof p === "string" ? (path === p || path.startsWith(p)) : p.test(path)));
}

// Risposta rapida per preflight (in pratica non serve, essendo same-origin, ma è utile)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function GET(request, ctx)    { return proxy(request, ctx); }
export async function POST(request, ctx)   { return proxy(request, ctx); }
export async function PUT(request, ctx)    { return proxy(request, ctx); }
export async function PATCH(request, ctx)  { return proxy(request, ctx); }
export async function DELETE(request, ctx) { return proxy(request, ctx); }

async function proxy(request, { params }) {
  const awaitedParams = await params;
  const subpath = "/" + (Array.isArray(awaitedParams?.path) ? awaitedParams.path.join("/") : "");
  
  if (!isAllowed(subpath)) {
    return json({ error: "Forbidden path", path: subpath }, 403);
  }

  const search = request.nextUrl?.search || "";
  const targetUrl = BACKEND + subpath + search;

  // Clona header e rimuovi quelli che non devono essere fissati a mano
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("connection");

  // Alcune librerie SSE richiedono questi header lato risposta (li settiamo dopo)
  const isSSE = subpath.includes("/logs/stream");

  const init = {
    method: request.method,
    headers,
    body: methodAllowsBody(request.method) ? request.body : undefined,
    redirect: "manual",
    cache: "no-store",
    ...(methodAllowsBody(request.method) ? { duplex: "half" } : {}), // pass-through stream body
  };

  try {
    const upstream = await fetch(targetUrl, init);

    // Copia headers della risposta
    const respHeaders = new Headers();
    
    // Copia tutti gli headers dalla risposta upstream
    for (const [key, value] of upstream.headers.entries()) {
      // Skip headers che potrebbero causare problemi
      if (!['connection', 'transfer-encoding', 'content-encoding'].includes(key.toLowerCase())) {
        respHeaders.set(key, value);
      }
    }

    // Evita caching
    respHeaders.set("Cache-Control", "no-store");

    // SSE: forza gli header giusti e no-buffering
    if (isSSE) {
      respHeaders.set("Content-Type", "text/event-stream");
      respHeaders.set("Connection", "keep-alive");
      respHeaders.set("X-Accel-Buffering", "no");
      respHeaders.set("Cache-Control", "no-cache");
      
      // Per Next.js e Vercel
      if (process.env.VERCEL) {
        respHeaders.set("X-Vercel-No-Buffer", "1");
      }
    }

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: respHeaders,
    });

  } catch (error) {
    console.error(`Proxy error for ${targetUrl}:`, error);
    return json({ 
      error: "Backend connection failed", 
      message: error.message,
      path: subpath,
      target: targetUrl 
    }, 502);
  }
}

function methodAllowsBody(m) {
  return !["GET", "HEAD"].includes(m?.toUpperCase?.() || "");
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}