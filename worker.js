/**
 * Cloudflare Worker - API dello storico risultati
 * Database: Cloudflare D1 (binding "DB")
 *
 * Endpoint:
 *  GET    /api/health                 -> verifica stato
 *  POST   /api/risultati              -> salva un risultato
 *  GET    /api/risultati?email=...    -> legge i risultati di uno studente
 *  DELETE /api/risultati?email=...    -> cancella i risultati di uno studente
 */
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '*';
    const cors = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' }
      });

    try {
      if (url.pathname === '/api/health') {
        return json({ ok: true, database: Boolean(env.DB) });
      }

      if (url.pathname === '/api/risultati') {
        if (request.method === 'POST') {
          const body = await request.json();
          const fields = ['data', 'nome', 'email', 'modalita', 'tempo', 'percentuale', 'voto'];
          if (!body || !fields.every(f => typeof body[f] === 'string' && body[f].trim())) {
            return json({ error: 'Dati incompleti' }, 400);
          }
          const values = fields.map(f => String(body[f]).slice(0, 200));
          await env.DB.prepare(
            'INSERT INTO risultati (data, nome, email, modalita, tempo, percentuale, voto) VALUES (?, ?, ?, ?, ?, ?, ?)'
          ).bind(...values).run();
          return json({ ok: true }, 201);
        }

        if (request.method === 'GET') {
          const email = url.searchParams.get('email');
          if (!email) return json({ error: 'Parametro email obbligatorio' }, 400);
          const { results } = await env.DB.prepare(
            'SELECT data, nome, email, modalita, tempo, percentuale, voto FROM risultati WHERE email = ? ORDER BY id DESC LIMIT 100'
          ).bind(email).all();
          return json({ risultati: results });
        }

        if (request.method === 'DELETE') {
          const email = url.searchParams.get('email');
          if (!email) return json({ error: 'Parametro email obbligatorio' }, 400);
          await env.DB.prepare('DELETE FROM risultati WHERE email = ?').bind(email).run();
          return json({ ok: true });
        }
      }

      return json({ error: 'Endpoint non trovato' }, 404);
    } catch (err) {
      return json({ error: String(err && err.message ? err.message : err) }, 500);
    }
  }
};
