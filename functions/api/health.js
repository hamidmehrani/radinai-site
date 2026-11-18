export async function onRequestGet() {
  return new Response(
    JSON.stringify({
      ok: true,
      status: 'healthy',
      service: 'radinai-edge',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}
