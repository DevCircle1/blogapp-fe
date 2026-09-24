// UNTESTED SKETCH — not deployed, not called by the site.
// Requires: a Google Cloud OAuth client (verified for the webmasters.readonly
// scope), GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET secrets, and supabase/gsc.sql.
// Flow: the signed-in user's stored refresh token -> access token -> Search
// Console searchanalytics/query (dimensions query+page, paged 25,000 rows) ->
// rows stored in gsc_snapshots and returned. The token never reaches the browser.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type' };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const auth = req.headers.get('Authorization') ?? '';
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: { user } } = await admin.auth.getUser(auth.replace('Bearer ', ''));
    if (!user) return new Response('Unauthorized', { status: 401, headers: cors });

    const { site_url, start, end } = await req.json();
    const { data: conn } = await admin.from('gsc_connections').select('refresh_token').eq('user_id', user.id).single();
    if (!conn) return new Response('Not connected', { status: 400, headers: cors });

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: Deno.env.get('GOOGLE_CLIENT_ID')!,
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!,
        refresh_token: conn.refresh_token,
        grant_type: 'refresh_token',
      }),
    });
    const { access_token } = await tokenRes.json();

    const rows: unknown[] = [];
    for (let startRow = 0; ; startRow += 25000) {
      const res = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site_url)}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ startDate: start, endDate: end, dimensions: ['query', 'page'], rowLimit: 25000, startRow }),
        },
      );
      const page = (await res.json()).rows ?? [];
      rows.push(...page);
      if (page.length < 25000) break;
    }
    const normalised = rows.map((r: any) => ({ query: r.keys[0], page: r.keys[1], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }));
    await admin.from('gsc_snapshots').insert({ user_id: user.id, site_url, period_start: start, period_end: end, rows: normalised });
    await admin.from('gsc_connections').update({ last_sync: new Date().toISOString() }).eq('user_id', user.id);
    return new Response(JSON.stringify({ rows: normalised }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(String(error), { status: 500, headers: cors });
  }
});
