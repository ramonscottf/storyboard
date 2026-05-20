// Lunch Angels Storyboard — Cloudflare Worker
// Backend: D1 + R2 + KV
// Frontend: served from same Worker

const ALLOWED_EMAILS = [
  'sfoster@dsdmail.net',
  'ramonscottf@gmail.com',
  // Kara - need her email - will accept her email + add it on first magic link request
];

const RESEND_API_KEY_PLACEHOLDER = 'RESEND_API_KEY'; // bind as secret

async function sha256(text) {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getSession(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/sb_session=([a-f0-9]+)/);
  if (!match) return null;
  const sessionId = match[1];
  const result = await env.DB.prepare('SELECT email FROM sessions WHERE session_id = ? AND last_seen > ?')
    .bind(sessionId, Date.now() - 30 * 24 * 60 * 60 * 1000)
    .first();
  return result?.email || null;
}

async function sendMagicLink(email, token, env) {
  const url = `https://storyboard.daviskids.org/auth/verify?token=${token}`;

  // Use the existing DEF mail.fosterlabs.org/send pattern from your memory
  const subject = 'Your Lunch Angels storyboard sign-in link';
  const html = `
    <div style="font-family:Georgia,serif;max-width:520px;margin:40px auto;padding:32px;background:#faf6ee;color:#2a2620;">
      <h1 style="font-size:24px;margin:0 0 8px 0;color:#8b1a1a;letter-spacing:-0.5px;">Lunch Angels</h1>
      <p style="color:#6b5a3a;font-size:13px;margin:0 0 32px 0;letter-spacing:1px;text-transform:uppercase;">DEF Gala 2026 Storyboard</p>
      <p style="font-size:16px;line-height:1.6;">Click below to sign in. Link expires in 15 minutes.</p>
      <p style="margin:32px 0;">
        <a href="${url}" style="display:inline-block;background:#8b1a1a;color:#faf6ee;padding:14px 28px;text-decoration:none;font-family:Georgia,serif;font-size:15px;letter-spacing:0.5px;">Sign In to the Storyboard →</a>
      </p>
      <p style="font-size:13px;color:#8a7a5a;line-height:1.5;">If you didn't request this, you can ignore this email.</p>
    </div>
  `;

  try {
    const resp = await fetch('https://mail.fosterlabs.org/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (env.MAIL_TOKEN || '')
      },
      body: JSON.stringify({
        from: 'storyboard@daviskids.org',
        to: email,
        subject,
        html,
        replyTo: 'sfoster@dsdmail.net'
      })
    });
    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Mail send failed:', errText);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Mail error:', e);
    return false;
  }
}

function confirmHtml(title, message, token) {
  const button = token ? `
    <button id="signin-btn" style="display:inline-block;background:#8b1a1a;color:#faf6ee;padding:14px 32px;text-decoration:none;font-family:'Cormorant Garamond',Georgia,serif;font-size:17px;letter-spacing:0.5px;border:none;cursor:pointer;width:100%;">Sign In →</button>
    <div id="msg" style="margin-top:16px;font-size:13px;color:#8a7a5a;"></div>
    <script>
      document.getElementById('signin-btn').addEventListener('click', async () => {
        const btn = document.getElementById('signin-btn');
        btn.disabled = true;
        btn.textContent = 'Signing in…';
        try {
          const r = await fetch('/auth/verify', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ token: ${JSON.stringify(token)} })
          });
          if (r.ok) {
            location.href = '/';
          } else {
            const d = await r.json();
            document.getElementById('msg').textContent = d.error || 'Sign-in failed.';
            btn.disabled = false;
            btn.textContent = 'Try again';
          }
        } catch (e) {
          document.getElementById('msg').textContent = 'Network error. Try again.';
          btn.disabled = false;
          btn.textContent = 'Sign In →';
        }
      });
    </script>
  ` : `<a href="/" style="display:inline-block;background:transparent;color:#8b1a1a;padding:12px 24px;text-decoration:none;font-family:'Cormorant Garamond',serif;font-size:15px;border:1px solid #8b1a1a;">Request a new link</a>`;

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Lunch Angels</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500&display=swap');
*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
body { font-family:'Inter',-apple-system,sans-serif; background:#faf6ee; color:#2a2620; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px;
  background-image: radial-gradient(circle at 20% 30%, rgba(139,26,26,0.04), transparent 40%), radial-gradient(circle at 80% 70%, rgba(212,165,93,0.06), transparent 40%); }
.card { max-width:440px; width:100%; background:rgba(255,255,255,0.6); border:1px solid rgba(139,26,26,0.12); padding:48px 40px; backdrop-filter:blur(8px); }
h1 { font-family:'Cormorant Garamond',Georgia,serif; font-size:32px; font-weight:500; color:#8b1a1a; letter-spacing:-0.5px; margin-bottom:4px; }
.sub { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#8a7a5a; margin-bottom:24px; }
p { font-size:15px; line-height:1.6; color:#4a4138; margin-bottom:24px; }
strong { color:#2a2620; font-weight:500; }
</style></head>
<body><div class="card">
  <h1>${title}</h1>
  <div class="sub">Lunch Angels — DEF Gala 2026</div>
  <p>${message}</p>
  ${button}
</div></body></html>`;
}

async function handleAuth(request, env, url) {
  const path = url.pathname;

  if (path === '/auth/request' && request.method === 'POST') {
    const { email } = await request.json();
    const normalizedEmail = email.toLowerCase().trim();

    // Allow Scott's two emails + accept any new email and add to allowlist on first request
    // (Kara will sign up with her email on first use)
    const allowed = ALLOWED_EMAILS.includes(normalizedEmail) ||
                    normalizedEmail.endsWith('@dsdmail.net') ||
                    normalizedEmail.endsWith('@daviskids.org');

    if (!allowed) {
      return jsonResponse({ error: 'Email not authorized' }, 403);
    }

    const token = randomToken();
    await env.DB.prepare('INSERT INTO magic_tokens (token, email, created_at, used) VALUES (?, ?, ?, 0)')
      .bind(token, normalizedEmail, Date.now()).run();

    const sent = await sendMagicLink(normalizedEmail, token, env);
    if (!sent) {
      return jsonResponse({ error: 'Could not send email. Try again.' }, 500);
    }
    return jsonResponse({ ok: true, message: 'Check your email.' });
  }

  // GET /auth/verify shows a confirmation page (does NOT consume the token)
  // This prevents email prefetchers (Outlook, etc.) from burning the token on link scan
  if (path === '/auth/verify' && request.method === 'GET') {
    const token = url.searchParams.get('token');
    if (!token) return new Response('No token', { status: 400 });

    // Just check if token exists and is valid — don't consume it yet
    const tokenRow = await env.DB.prepare('SELECT email, created_at, used FROM magic_tokens WHERE token = ?')
      .bind(token).first();

    if (!tokenRow) {
      return new Response(confirmHtml('Invalid sign-in link', 'This link is not recognized. Request a new one.', null), {
        headers: { 'Content-Type': 'text/html;charset=utf-8' }
      });
    }
    if (tokenRow.used) {
      return new Response(confirmHtml('Already used', 'This sign-in link has already been used. Request a new one if you need to sign in again.', null), {
        headers: { 'Content-Type': 'text/html;charset=utf-8' }
      });
    }
    if (Date.now() - tokenRow.created_at > 15 * 60 * 1000) {
      return new Response(confirmHtml('Link expired', 'This link expired. Sign-in links last 15 minutes — request a fresh one.', null), {
        headers: { 'Content-Type': 'text/html;charset=utf-8' }
      });
    }

    // Token is valid — show the click-to-sign-in confirmation page
    return new Response(confirmHtml('Sign in to the Storyboard', `You're signing in as <strong>${tokenRow.email}</strong>.`, token), {
      headers: { 'Content-Type': 'text/html;charset=utf-8' }
    });
  }

  // POST /auth/verify actually consumes the token and creates a session
  if (path === '/auth/verify' && request.method === 'POST') {
    const { token } = await request.json();
    if (!token) return jsonResponse({ error: 'No token' }, 400);

    const tokenRow = await env.DB.prepare('SELECT email, created_at, used FROM magic_tokens WHERE token = ?')
      .bind(token).first();

    if (!tokenRow) return jsonResponse({ error: 'Invalid token' }, 400);
    if (tokenRow.used) return jsonResponse({ error: 'Already used' }, 400);
    if (Date.now() - tokenRow.created_at > 15 * 60 * 1000) {
      return jsonResponse({ error: 'Expired' }, 400);
    }

    // Mark used, create session
    await env.DB.prepare('UPDATE magic_tokens SET used = 1 WHERE token = ?').bind(token).run();
    const sessionId = randomToken();
    const now = Date.now();
    await env.DB.prepare('INSERT INTO sessions (session_id, email, created_at, last_seen) VALUES (?, ?, ?, ?)')
      .bind(sessionId, tokenRow.email, now, now).run();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `sb_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`
      }
    });
  }

  if (path === '/auth/logout' && request.method === 'POST') {
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(/sb_session=([a-f0-9]+)/);
    if (match) {
      await env.DB.prepare('DELETE FROM sessions WHERE session_id = ?').bind(match[1]).run();
    }
    return new Response('', {
      status: 200,
      headers: { 'Set-Cookie': 'sb_session=; Path=/; Max-Age=0' }
    });
  }

  if (path === '/auth/me') {
    const email = await getSession(request, env);
    return jsonResponse({ email });
  }

  return new Response('Not found', { status: 404 });
}

async function handleApi(request, env, url) {
  const email = await getSession(request, env);
  if (!email) return jsonResponse({ error: 'Not authenticated' }, 401);

  // Touch session
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/sb_session=([a-f0-9]+)/);
  if (match) {
    await env.DB.prepare('UPDATE sessions SET last_seen = ? WHERE session_id = ?')
      .bind(Date.now(), match[1]).run();
  }

  const path = url.pathname;

  // GET /api/state - everything in one call for fast loads
  if (path === '/api/state' && request.method === 'GET') {
    const [shots, characters, refs, comments] = await Promise.all([
      env.DB.prepare('SELECT * FROM shots ORDER BY id').all(),
      env.DB.prepare('SELECT * FROM characters').all(),
      env.DB.prepare('SELECT * FROM style_refs ORDER BY sort_order, id').all(),
      env.DB.prepare('SELECT id, shot_id, email, body, created_at FROM comments ORDER BY shot_id, created_at').all()
    ]);
    return jsonResponse({
      email,
      shots: shots.results,
      characters: characters.results,
      style_refs: refs.results,
      comments: comments.results
    });
  }

  // POST /api/style_ref - add a style reference image
  if (path === '/api/style_ref' && request.method === 'POST') {
    const { image_key, label } = await request.json();
    const max = await env.DB.prepare('SELECT MAX(sort_order) as m FROM style_refs').first();
    const order = (max?.m || 0) + 1;
    await env.DB.prepare('INSERT INTO style_refs (image_key, label, sort_order, uploaded_at, uploaded_by) VALUES (?, ?, ?, ?, ?)')
      .bind(image_key, label || '', order, Date.now(), email).run();
    return jsonResponse({ ok: true });
  }

  // DELETE /api/style_ref/:id
  const refMatch = path.match(/^\/api\/style_ref\/(\d+)$/);
  if (refMatch && request.method === 'DELETE') {
    const refId = parseInt(refMatch[1]);
    await env.DB.prepare('DELETE FROM style_refs WHERE id = ?').bind(refId).run();
    return jsonResponse({ ok: true });
  }

  // PUT /api/shot/:id - update shot fields
  const shotMatch = path.match(/^\/api\/shot\/(\d+)$/);
  if (shotMatch && request.method === 'PUT') {
    const shotId = parseInt(shotMatch[1]);
    const body = await request.json();
    const allowed = ['notes', 'status', 'winner_image_key', 'start_frame_key', 'end_frame_key', 'candidate_keys', 'flow_motion_prompt', 'chatgpt_prompt', 'video_candidate_keys', 'winner_video_key', 'title', 'description', 'vo_quote', 'vo_who'];
    const updates = [];
    const params = [];
    for (const k of allowed) {
      if (k in body) {
        updates.push(`${k} = ?`);
        params.push(body[k]);
      }
    }
    if (!updates.length) return jsonResponse({ error: 'No fields to update' }, 400);
    updates.push('updated_at = ?', 'updated_by = ?');
    params.push(Date.now(), email, shotId);
    await env.DB.prepare(`UPDATE shots SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();
    return jsonResponse({ ok: true });
  }

  // PUT /api/character/:id - update character
  const charMatch = path.match(/^\/api\/character\/([a-z]+)$/);
  if (charMatch && request.method === 'PUT') {
    const charId = charMatch[1];
    const body = await request.json();
    const allowed = ['description', 'image_key', 'chatgpt_prompt', 'notes', 'candidate_keys', 'status'];
    const updates = [];
    const params = [];
    for (const k of allowed) {
      if (k in body) {
        updates.push(`${k} = ?`);
        params.push(body[k]);
      }
    }
    if (!updates.length) return jsonResponse({ error: 'No fields' }, 400);
    updates.push('updated_at = ?', 'updated_by = ?');
    params.push(Date.now(), email, charId);
    await env.DB.prepare(`UPDATE characters SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();
    return jsonResponse({ ok: true });
  }

  // POST /api/upload - upload image OR video to R2, returns key
  if (path === '/api/upload' && request.method === 'POST') {
    const contentType = request.headers.get('content-type') || 'image/png';
    let ext = 'bin';
    if (contentType.includes('jpeg')) ext = 'jpg';
    else if (contentType.includes('png')) ext = 'png';
    else if (contentType.includes('webp')) ext = 'webp';
    else if (contentType.includes('mp4')) ext = 'mp4';
    else if (contentType.includes('quicktime') || contentType.includes('mov')) ext = 'mov';
    else if (contentType.includes('webm')) ext = 'webm';
    const key = `${Date.now()}-${randomToken().slice(0, 8)}.${ext}`;
    const body = await request.arrayBuffer();
    const isVideo = contentType.startsWith('video/');
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (body.byteLength > maxSize) {
      return jsonResponse({ error: `File too large (${isVideo ? '100MB' : '10MB'} max)` }, 400);
    }
    await env.IMAGES.put(key, body, {
      httpMetadata: { contentType }
    });
    return jsonResponse({ key, url: `/img/${key}`, isVideo });
  }

  // GET /img/:key - fetch image from R2
  // (handled at top-level routing)

  // POST /api/comment - add comment to a shot
  if (path === '/api/comment' && request.method === 'POST') {
    const { shot_id, body: commentBody } = await request.json();
    const result = await env.DB.prepare('INSERT INTO comments (shot_id, email, body, created_at) VALUES (?, ?, ?, ?) RETURNING id')
      .bind(shot_id, email, commentBody, Date.now()).first();
    return jsonResponse({ ok: true, id: result?.id });
  }

  // GET /api/comments/:id - get comments for a single shot
  const commentMatch = path.match(/^\/api\/comments\/(\d+)$/);
  if (commentMatch && request.method === 'GET') {
    const shotId = parseInt(commentMatch[1]);
    const result = await env.DB.prepare('SELECT id, email, body, created_at FROM comments WHERE shot_id = ? ORDER BY created_at')
      .bind(shotId).all();
    return jsonResponse({ comments: result.results });
  }

  // GET /api/comments - get ALL comments grouped by shot (for board view)
  if (path === '/api/comments' && request.method === 'GET') {
    const result = await env.DB.prepare('SELECT id, shot_id, email, body, created_at FROM comments ORDER BY shot_id, created_at').all();
    return jsonResponse({ comments: result.results });
  }

  // DELETE /api/comment/:id - delete a comment (only by author)
  const delMatch = path.match(/^\/api\/comment\/(\d+)$/);
  if (delMatch && request.method === 'DELETE') {
    const cid = parseInt(delMatch[1]);
    const row = await env.DB.prepare('SELECT email FROM comments WHERE id = ?').bind(cid).first();
    if (!row) return jsonResponse({ error: 'Not found' }, 404);
    if (row.email !== email) return jsonResponse({ error: 'Not yours to delete' }, 403);
    await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(cid).run();
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ error: 'Not found' }, 404);
}

async function handleImage(env, key) {
  const obj = await env.IMAGES.get(key);
  if (!obj) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('Cache-Control', 'public, max-age=86400');
  return new Response(obj.body, { headers });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Image proxy
    if (path.startsWith('/img/')) {
      return handleImage(env, path.slice(5));
    }

    // Auth routes (no session needed)
    if (path.startsWith('/auth/')) {
      return handleAuth(request, env, url);
    }

    // API routes (session needed)
    if (path.startsWith('/api/')) {
      return handleApi(request, env, url);
    }

    // Frontend
    const session = await getSession(request, env);
    if (!session) {
      return new Response(LOGIN_HTML, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
    }
    if (path === '/board') {
      return new Response(BOARD_HTML, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
    }
    return new Response(APP_HTML, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
  }
};

const LOGIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lunch Angels Storyboard — Sign In</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap');
  *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #faf6ee;
    color: #2a2620;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background-image: radial-gradient(circle at 20% 30%, rgba(139,26,26,0.04), transparent 40%),
                      radial-gradient(circle at 80% 70%, rgba(212,165,93,0.06), transparent 40%);
  }
  .card {
    max-width: 440px;
    width: 100%;
    background: rgba(255,255,255,0.6);
    border: 1px solid rgba(139,26,26,0.12);
    backdrop-filter: blur(8px);
    padding: 48px 40px;
    box-shadow: 0 4px 32px rgba(58,34,18,0.06);
  }
  h1 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 38px;
    font-weight: 500;
    color: #8b1a1a;
    letter-spacing: -1px;
    margin-bottom: 4px;
  }
  .sub {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #8a7a5a;
    margin-bottom: 32px;
  }
  p { font-size: 15px; line-height: 1.6; color: #4a4138; margin-bottom: 24px; }
  label { display:block; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #6b5a3a; margin-bottom: 8px; }
  input[type=email] {
    width: 100%;
    padding: 14px 16px;
    font-size: 16px;
    font-family: inherit;
    background: #fff;
    border: 1px solid #d6c9a8;
    color: #2a2620;
    margin-bottom: 20px;
  }
  input[type=email]:focus { outline: none; border-color: #8b1a1a; }
  button {
    width: 100%;
    padding: 14px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    background: #8b1a1a;
    color: #faf6ee;
    border: none;
    cursor: pointer;
    letter-spacing: 0.5px;
    transition: background .2s;
  }
  button:hover { background: #6f1414; }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
  .msg { margin-top: 20px; padding: 12px; font-size: 14px; }
  .msg.ok { background: #f0e8d4; color: #4a3a18; }
  .msg.err { background: #fbe5e5; color: #8b1a1a; }
</style>
</head>
<body>
  <div class="card">
    <h1>Lunch Angels</h1>
    <div class="sub">DEF Gala 2026 — Storyboard</div>
    <p>Sign in with a magic link. Enter your email and we'll send you a one-click sign-in.</p>
    <label>Email</label>
    <input type="email" id="email" autocomplete="email" placeholder="you@dsdmail.net">
    <button id="btn">Send sign-in link</button>
    <div id="msg"></div>
  </div>
<script>
const btn = document.getElementById('btn');
const msg = document.getElementById('msg');
btn.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  if (!email) return;
  btn.disabled = true;
  btn.textContent = 'Sending…';
  msg.className = '';
  msg.textContent = '';
  try {
    const r = await fetch('/auth/request', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({email})
    });
    const d = await r.json();
    if (r.ok) {
      msg.className = 'msg ok';
      msg.textContent = 'Check your email for the sign-in link.';
    } else {
      msg.className = 'msg err';
      msg.textContent = d.error || 'Something went wrong.';
    }
  } catch (e) {
    msg.className = 'msg err';
    msg.textContent = 'Network error.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send sign-in link';
  }
});
document.getElementById('email').addEventListener('keydown', e => {
  if (e.key === 'Enter') btn.click();
});
</script>
</body>
</html>`;

// MAIN APP HTML - long, in separate constant
const APP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lunch Angels — Storyboard</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap');
  *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --paper: #faf6ee;
    --paper-2: #f3ecdb;
    --ink: #2a2620;
    --ink-soft: #4a4138;
    --muted: #8a7a5a;
    --rule: #d6c9a8;
    --red: #8b1a1a;
    --red-soft: #b85c5c;
    --amber: #c98e3b;
    --gold: #d4a55d;
    --lavender: #a8b0c8;
    --shadow: rgba(58,34,18,0.08);
  }
  html,body { background: var(--paper); color: var(--ink); font-family: 'Inter', -apple-system, sans-serif; min-height: 100vh; }
  body {
    background-image: radial-gradient(circle at 15% 10%, rgba(139,26,26,0.025), transparent 40%),
                      radial-gradient(circle at 85% 90%, rgba(212,165,93,0.04), transparent 50%);
  }
  .header {
    position: sticky;
    top: 0;
    background: rgba(250,246,238,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--rule);
    z-index: 100;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .header h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 500;
    color: var(--red);
    letter-spacing: -0.5px;
  }
  .header h1 .sub {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 500;
    margin-top: 2px;
  }
  .header-right { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--muted); }
  .header-right button {
    background: transparent;
    border: 1px solid var(--rule);
    color: var(--ink-soft);
    padding: 6px 12px;
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
  }
  .header-right button:hover { border-color: var(--red); color: var(--red); }

  .container { max-width: 1280px; margin: 0 auto; padding: 24px; }
  @media (max-width: 700px) { .container { padding: 16px; } }

  .progress-bar {
    background: var(--paper-2);
    height: 6px;
    margin-bottom: 32px;
    overflow: hidden;
    border: 1px solid var(--rule);
  }
  .progress-bar > div {
    height: 100%;
    background: linear-gradient(90deg, var(--red), var(--amber));
    transition: width .4s;
  }
  .progress-text {
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
  }

  /* Style references */
  .ref-howto {
    background: rgba(212,165,93,0.08);
    border: 1px solid rgba(212,165,93,0.3);
    padding: 16px 20px;
    margin-bottom: 24px;
  }
  .ref-howto-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    font-weight: 500;
    color: var(--ink);
    margin-bottom: 8px;
  }
  .ref-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
    margin-bottom: 48px;
  }
  .ref-card {
    background: rgba(255,255,255,0.4);
    border: 1px solid var(--rule);
    aspect-ratio: 4/3;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: transform .15s, border-color .15s;
  }
  .ref-card:hover { border-color: var(--red); transform: translateY(-2px); }
  .ref-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ref-card-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(0deg, rgba(0,0,0,0.75), transparent);
    color: var(--paper);
    padding: 16px 10px 8px;
    font-size: 11px;
    line-height: 1.3;
    letter-spacing: 0.3px;
  }
  .ref-card-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 6px;
    opacity: 0;
    transition: opacity .15s;
  }
  .ref-card:hover .ref-card-actions { opacity: 1; }
  .ref-card-actions a, .ref-card-actions button {
    background: rgba(255,255,255,0.95);
    border: none;
    padding: 5px 9px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: inherit;
    cursor: pointer;
    color: var(--ink);
    text-decoration: none;
    display: inline-block;
  }
  .ref-card-actions a:hover, .ref-card-actions button:hover { background: var(--red); color: var(--paper); }
  .ref-add-card {
    background: var(--paper-2);
    border: 2px dashed var(--rule);
    aspect-ratio: 4/3;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--muted);
    font-size: 13px;
    text-align: center;
    padding: 12px;
  }
  .ref-add-card:hover { border-color: var(--red); color: var(--red); }
  .ref-add-card.drag-over { border-color: var(--red); color: var(--red); border-style: solid; background: rgba(139,26,26,0.06); }

  /* Characters section */
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 500;
    color: var(--ink);
    margin-bottom: 4px;
    letter-spacing: -0.5px;
  }
  .section-eyebrow {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--red);
    margin-bottom: 24px;
    font-weight: 500;
  }
  .char-grid { display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px; }
  .char-card {
    background: rgba(255,255,255,0.5);
    border: 1px solid var(--rule);
    transition: border-color .15s;
  }
  .char-card.expanded { border-color: var(--red); box-shadow: 0 4px 24px var(--shadow); }
  .char-card.status-locked { background: linear-gradient(180deg, rgba(196,160,98,0.08), rgba(255,255,255,0.5)); }
  .char-header {
    padding: 14px 18px;
    cursor: pointer;
    display: grid;
    grid-template-columns: 64px 1fr auto;
    gap: 16px;
    align-items: center;
  }
  .char-locked-thumb {
    width: 64px;
    height: 64px;
    background: var(--paper-2);
    border: 1px solid var(--rule);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .char-locked-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .thumb-placeholder { font-size: 24px; color: var(--muted); font-weight: 300; }
  .char-title-row { min-width: 0; }
  .char-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.2;
    margin-bottom: 4px;
  }
  .char-meta { display: flex; gap: 12px; font-size: 12px; color: var(--muted); flex-wrap: wrap; align-items: center; }
  .char-card.expanded .chevron { transform: rotate(180deg); }
  .char-body { display: none; padding: 0 18px 18px; }
  .char-card.expanded .char-body { display: block; }
  .char-candidate-grid { grid-template-columns: repeat(4, 1fr); }
  @media (max-width: 700px) {
    .char-candidate-grid { grid-template-columns: repeat(2, 1fr); }
    .char-header { grid-template-columns: 56px 1fr auto; padding: 12px 14px; }
    .char-locked-thumb { width: 56px; height: 56px; }
    .char-name { font-size: 18px; }
  }

  /* Shots section */
  .shots-section { margin-top: 48px; }
  .shot-card {
    background: rgba(255,255,255,0.5);
    border: 1px solid var(--rule);
    margin-bottom: 16px;
    transition: border-color .15s;
  }
  .shot-card.expanded { border-color: var(--red); box-shadow: 0 4px 24px var(--shadow); }
  .shot-card.drop-active {
    border-color: var(--red);
    box-shadow: 0 0 0 4px rgba(139,26,26,0.12), 0 8px 32px var(--shadow);
    background: rgba(139,26,26,0.04);
  }
  .shot-card.drop-active::before {
    content: 'Drop images to fill candidates →';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--red);
    color: var(--paper);
    padding: 16px 24px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    letter-spacing: 0.5px;
    z-index: 10;
    pointer-events: none;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  }
  .shot-card { position: relative; }
  .shot-card.status-locked { background: linear-gradient(180deg, rgba(196,160,98,0.08), rgba(255,255,255,0.5)); }
  .shot-header {
    padding: 16px 20px;
    cursor: pointer;
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    gap: 16px;
    align-items: center;
  }
  .shot-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 400;
    color: var(--red);
    line-height: 1;
    width: 44px;
    text-align: center;
  }
  .shot-title-row { min-width: 0; }
  .shot-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.2;
    margin-bottom: 4px;
  }
  .shot-meta {
    display: flex;
    gap: 12px;
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--muted);
    flex-wrap: wrap;
  }
  .shot-status {
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 4px 10px;
    border: 1px solid var(--rule);
    color: var(--muted);
  }
  .shot-status.status-pending { color: var(--muted); border-color: var(--rule); }
  .shot-status.status-generating { color: var(--amber); border-color: var(--amber); }
  .shot-status.status-locked { color: var(--red); border-color: var(--red); background: rgba(139,26,26,0.05); }
  .type-badge {
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 0;
  }
  .type-badge.type-scene { background: rgba(168,176,200,0.2); color: #5a6680; }
  .type-badge.type-broll { background: rgba(201,142,59,0.2); color: var(--amber); }
  .type-badge.type-comp { background: rgba(74,65,56,0.1); color: var(--ink-soft); }
  .type-badge.type-audio { background: rgba(139,26,26,0.1); color: var(--red); }
  .chevron { color: var(--muted); transition: transform .2s; }
  .shot-card.expanded .chevron { transform: rotate(180deg); }

  .shot-body { display: none; padding: 0 20px 20px; }
  .shot-card.expanded .shot-body { display: block; }
  .shot-section { margin-top: 20px; }
  .shot-section-label {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
    font-weight: 600;
  }
  .desc-text { font-size: 14px; line-height: 1.6; color: var(--ink-soft); }

  .prompt-box {
    background: var(--paper-2);
    border: 1px solid var(--rule);
    padding: 16px;
    font-family: 'JetBrains Mono', 'Menlo', monospace;
    font-size: 12px;
    line-height: 1.55;
    color: var(--ink);
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 280px;
    overflow-y: auto;
    position: relative;
  }
  .copy-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: var(--paper);
    border: 1px solid var(--rule);
    padding: 6px 10px;
    font-size: 11px;
    cursor: pointer;
    font-family: inherit;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .copy-btn:hover { border-color: var(--red); color: var(--red); }
  .copy-btn.copied { background: var(--red); color: var(--paper); border-color: var(--red); }

  /* Image candidate grid */
  .candidate-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  @media (max-width: 600px) { .candidate-grid { grid-template-columns: 1fr; } }
  .candidate-slot {
    aspect-ratio: 3/2;
    background: var(--paper-2);
    border: 2px dashed var(--rule);
    cursor: pointer;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color .15s, background .15s;
  }
  .candidate-slot.aspect-16-9 { aspect-ratio: 16/9; }
  .candidate-slot.drag-over { border-color: var(--red); background: rgba(139,26,26,0.08); border-style: solid; }
  .candidate-slot:hover { border-color: var(--red); }
  .candidate-slot img { width: 100%; height: 100%; object-fit: cover; }
  .candidate-slot video { width: 100%; height: 100%; object-fit: cover; background: #000; }
  .candidate-slot.is-winner { border: 3px solid var(--red); border-style: solid; }
  .candidate-slot .winner-star {
    position: absolute;
    top: 8px;
    right: 8px;
    background: var(--red);
    color: var(--paper);
    font-size: 11px;
    padding: 4px 8px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .candidate-slot .placeholder {
    text-align: center;
    color: var(--muted);
    font-size: 12px;
    padding: 12px;
  }
  .candidate-slot .candidate-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(0deg, rgba(0,0,0,0.7), transparent);
    padding: 12px 8px 8px;
    display: flex;
    gap: 6px;
    opacity: 0;
    transition: opacity .15s;
  }
  .candidate-slot:hover .candidate-actions { opacity: 1; }
  .candidate-actions button {
    flex: 1;
    background: rgba(255,255,255,0.9);
    border: none;
    padding: 6px 8px;
    font-size: 10px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-family: inherit;
    cursor: pointer;
    color: var(--ink);
  }
  .candidate-actions button:hover { background: var(--red); color: var(--paper); }

  /* Frame slots */
  .frame-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .frame-slot {
    aspect-ratio: 3/2;
    background: var(--paper-2);
    border: 2px dashed var(--rule);
    cursor: pointer;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color .15s, background .15s;
  }
  .frame-slot:hover { border-color: var(--amber); }
  .frame-slot.drag-over { border-color: var(--amber); background: rgba(212,165,93,0.12); border-style: solid; }
  .frame-slot img { width: 100%; height: 100%; object-fit: cover; }
  .frame-slot .frame-label {
    position: absolute;
    top: 8px;
    left: 8px;
    background: var(--amber);
    color: var(--paper);
    font-size: 10px;
    padding: 3px 8px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .frame-slot .placeholder { text-align: center; color: var(--muted); font-size: 12px; padding: 12px; }

  textarea {
    width: 100%;
    min-height: 80px;
    padding: 12px;
    font-family: inherit;
    font-size: 14px;
    background: rgba(255,255,255,0.7);
    border: 1px solid var(--rule);
    color: var(--ink);
    line-height: 1.5;
    resize: vertical;
  }
  textarea:focus { outline: none; border-color: var(--red); }

  .status-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
  .status-buttons button {
    background: transparent;
    border: 1px solid var(--rule);
    padding: 8px 14px;
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--ink-soft);
    cursor: pointer;
    font-family: inherit;
    transition: all .15s;
  }
  .status-buttons button:hover { border-color: var(--ink); }
  .status-buttons button.active { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .status-buttons button.active.status-locked { background: var(--red); border-color: var(--red); }

  /* Hidden file inputs */
  input[type=file] { display: none; }

  .save-indicator {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--ink);
    color: var(--paper);
    padding: 10px 16px;
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0;
    transition: opacity .2s;
    z-index: 1000;
  }
  .save-indicator.show { opacity: 0.85; }

  /* Lightbox */
  .lightbox {
    position: fixed;
    inset: 0;
    background: rgba(20,16,12,0.92);
    z-index: 200;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 24px;
    cursor: pointer;
  }
  .lightbox.show { display: flex; }
  .lightbox img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .lightbox-close {
    position: absolute;
    top: 24px;
    right: 24px;
    background: transparent;
    color: var(--paper);
    border: 1px solid var(--paper);
    padding: 8px 14px;
    font-family: inherit;
    cursor: pointer;
  }

  /* Mobile tweaks */
  @media (max-width: 700px) {
    .shot-header { grid-template-columns: auto 1fr auto; gap: 10px; padding: 14px; }
    .shot-num { font-size: 26px; width: 36px; }
    .shot-title { font-size: 16px; }
    .shot-status { display: none; }
    .header h1 { font-size: 20px; }
    .candidate-grid { grid-template-columns: 1fr 1fr; }
  }
</style>
</head>
<body>
  <div class="header">
    <h1>Lunch Angels<span class="sub">DEF Gala 2026 Storyboard</span></h1>
    <div class="header-right">
      <span id="who"></span>
      <a href="/board" style="background:transparent;border:1px solid var(--rule);color:var(--ink-soft);padding:6px 12px;font-size:12px;text-decoration:none;font-family:inherit;">Storyboard view →</a>
      <button onclick="logout()">Sign out</button>
    </div>
  </div>

  <div class="container">
    <div class="progress-text">
      <span>Production Progress</span>
      <span id="progress-count">0 of 22 locked</span>
    </div>
    <div class="progress-bar"><div id="progress-fill" style="width:0%"></div></div>

    <div class="section-eyebrow">Phase 0 — Style References</div>
    <div class="section-title">Look &amp; Feel</div>
    <p style="color:var(--ink-soft);font-size:14px;line-height:1.6;margin:8px 0 16px;max-width:680px;">These images define the entire visual style of the film. <strong>Drop them into Flow as Ingredients every time you generate</strong>. Each shot prompt tells you exactly which references to use. Same anchors every time = consistent film.</p>

    <div class="ref-howto">
      <div class="ref-howto-title">📋 How to use these in Flow</div>
      <ol style="margin:0; padding-left:20px; color:var(--ink-soft); font-size:13px; line-height:1.7;">
        <li>Click any reference image below to download it (or right-click → Save).</li>
        <li>In Flow, add <strong>3–4 of these as Ingredients</strong> + the relevant character reference.</li>
        <li>Paste the shot's prompt. The prompt is already tuned for Flow.</li>
        <li>If a generation drifts off-style, regenerate with the message "Match the watercolor and gouache aesthetic of the references more closely."</li>
      </ol>
    </div>

    <div class="ref-grid" id="ref-grid"></div>

    <div class="section-eyebrow">Phase 1 — Character Sheets</div>
    <div class="section-title">Cast</div>
    <p style="color:var(--ink-soft);font-size:14px;line-height:1.6;margin:8px 0 24px;max-width:600px;">Lock your three character portraits before generating any scenes. Click each card to expand — you'll see the Flow prompt, drop in 4 generation variations, and lock the winner with a click. Locked portraits become reference Ingredients for every scene.</p>
    <div class="char-grid" id="char-grid"></div>

    <div class="section-eyebrow">Phase 2 — Scene Boards</div>
    <div class="section-title">22 Shots</div>
    <p style="color:var(--ink-soft);font-size:14px;line-height:1.6;margin:8px 0 24px;max-width:600px;">Each shot expands to show its prompt, image candidates, start/end frames, and Flow motion prompt. Click any image to view full size. All changes auto-save.</p>

    <div class="shots-section" id="shots-section"></div>
  </div>

  <div class="save-indicator" id="save-indicator">Saved</div>

  <div class="lightbox" id="lightbox" onclick="closeLightbox()">
    <button class="lightbox-close">Close ×</button>
    <img id="lightbox-img">
  </div>

<script>
let state = { shots: [], characters: [], email: '' };
const saveTimers = {};

async function loadState() {
  const r = await fetch('/api/state');
  if (!r.ok) { location.reload(); return; }
  const d = await r.json();
  state = d;
  document.getElementById('who').textContent = d.email;
  renderStyleRefs();
  renderCharacters();
  renderShots();
  updateProgress();
}

function renderStyleRefs() {
  const grid = document.getElementById('ref-grid');
  const refs = state.style_refs || [];
  let html = refs.map(r => \`
    <div class="ref-card" onclick="openLightbox('\${r.image_key}')">
      <img src="/img/\${r.image_key}" alt="\${escapeHtml(r.label || '')}">
      <div class="ref-card-actions">
        <a href="/img/\${r.image_key}" download="style-ref-\${r.id}.jpg" onclick="event.stopPropagation();">Download</a>
        <button onclick="event.stopPropagation();deleteStyleRef(\${r.id})">×</button>
      </div>
      \${r.label ? \`<div class="ref-card-label">\${escapeHtml(r.label)}</div>\` : ''}
    </div>
  \`).join('');
  html += \`<div class="ref-add-card"
    onclick="addStyleRef()"
    ondragenter="dragEnter(event, this)"
    ondragover="dragOver(event)"
    ondragleave="dragLeave(event, this)"
    ondrop="dropOnStyleRef(event, this)">+ Drop or click to add reference</div>\`;
  grid.innerHTML = html;
}

async function dropOnStyleRef(e, el) {
  e.preventDefault();
  e.stopPropagation();
  el.classList.remove('drag-over');
  const files = getImageFiles(e.dataTransfer);
  if (!files.length) return;
  for (const file of files) {
    const key = await uploadFile(file);
    await fetch('/api/style_ref', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ image_key: key, label: '' })
    });
  }
  await loadState();
  showSaved();
}

async function addStyleRef() {
  pickFile(async (file) => {
    const key = await uploadFile(file);
    const label = prompt('Label for this reference (optional):', '') || '';
    await fetch('/api/style_ref', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ image_key: key, label })
    });
    await loadState();
    showSaved();
  });
}

async function deleteStyleRef(id) {
  if (!confirm('Remove this style reference?')) return;
  await fetch('/api/style_ref/' + id, { method: 'DELETE' });
  await loadState();
  showSaved();
}

function showSaved() {
  const el = document.getElementById('save-indicator');
  el.classList.add('show');
  clearTimeout(showSaved._t);
  showSaved._t = setTimeout(() => el.classList.remove('show'), 1500);
}

function updateProgress() {
  const locked = state.shots.filter(s => s.status === 'locked').length;
  const total = state.shots.length;
  document.getElementById('progress-count').textContent = locked + ' of ' + total + ' locked';
  document.getElementById('progress-fill').style.width = (100 * locked / total) + '%';
}

function renderCharacters() {
  const grid = document.getElementById('char-grid');
  grid.innerHTML = state.characters.map(c => renderCharacter(c)).join('');
}

function renderCharacter(c) {
  const candidates = c.candidate_keys ? JSON.parse(c.candidate_keys) : ['','','',''];
  while (candidates.length < 4) candidates.push('');
  const status = c.status || 'pending';
  const isExpanded = expandedChars.has(c.id);
  return \`
  <div class="char-card status-\${status} \${isExpanded?'expanded':''}" id="char-\${c.id}">
    <div class="char-header" onclick="toggleChar('\${c.id}')">
      <div class="char-locked-thumb" onclick="event.stopPropagation();\${c.image_key ? \`openLightbox('\${c.image_key}')\` : \`uploadCharCandidate('\${c.id}', 0)\`}">
        \${c.image_key ? '<img src="/img/' + c.image_key + '">' : '<div class="thumb-placeholder">+</div>'}
      </div>
      <div class="char-title-row">
        <div class="char-name">\${escapeHtml(c.name)}</div>
        <div class="char-meta">
          <span class="shot-status status-\${status}">\${status === 'locked' ? '✓ locked' : status}</span>
          \${c.image_key ? '<span style="color:var(--red);font-weight:500;">⭐ Locked</span>' : '<span style="color:var(--muted);">No portrait yet</span>'}
        </div>
      </div>
      <div class="chevron">▾</div>
    </div>

    <div class="char-body">
      <div class="shot-section">
        <div class="shot-section-label">Description</div>
        <div class="desc-text">\${escapeHtml(c.description || '').replace(/\\n\\n/g,'<br><br>').replace(/\\n/g,'<br>')}</div>
      </div>

      <div class="shot-section">
        <div class="shot-section-label">Flow Prompt — Hero Portrait</div>
        <div class="prompt-box">\${escapeHtml(c.chatgpt_prompt || '')}<button class="copy-btn" onclick="copyCharPrompt(this, '\${c.id}')">Copy</button></div>
      </div>

      <div class="shot-section">
        <div class="shot-section-label">Generation Candidates — drop or click to upload, click ⭐ to lock the winner</div>
        <div class="candidate-grid char-candidate-grid">
          \${candidates.map((key, i) => \`
            <div class="candidate-slot \${key && key === c.image_key ? 'is-winner' : ''}"
                 onclick="uploadCharCandidate('\${c.id}', \${i})"
                 ondragenter="dragEnter(event, this)"
                 ondragover="dragOver(event)"
                 ondragleave="dragLeave(event, this)"
                 ondrop="dropOnCharCandidate(event, this, '\${c.id}', \${i})">
              \${key
                ? '<img src="/img/' + key + '" onclick="event.stopPropagation();openLightbox(\\''+key+'\\')">' +
                  (key === c.image_key ? '<div class="winner-star">⭐ Locked</div>' : '') +
                  '<div class="candidate-actions">' +
                    '<button onclick="event.stopPropagation();lockCharImage(\\''+c.id+'\\',\\''+key+'\\')">Lock</button>' +
                    '<button onclick="event.stopPropagation();removeCharCandidate(\\''+c.id+'\\',' + i + ')">Remove</button>' +
                  '</div>'
                : '<div class="placeholder">+ Drop or click<br><small>variant ' + (i+1) + '</small></div>'}
            </div>
          \`).join('')}
        </div>
      </div>

      <div class="shot-section">
        <div class="shot-section-label">Direction Notes</div>
        <textarea oninput="saveCharacter('\${c.id}','notes',this.value)">\${escapeHtml(c.notes || '')}</textarea>
      </div>

      <div class="shot-section">
        <div class="shot-section-label">Status</div>
        <div class="status-buttons">
          <button onclick="setCharStatus('\${c.id}','pending')" class="\${status==='pending'?'active':''}">Pending</button>
          <button onclick="setCharStatus('\${c.id}','generating')" class="\${status==='generating'?'active':''}">Generating</button>
          <button onclick="setCharStatus('\${c.id}','locked')" class="status-locked \${status==='locked'?'active':''}">Locked ✓</button>
        </div>
      </div>
    </div>
  </div>\`;
}

const expandedChars = new Set();

function toggleChar(id) {
  if (expandedChars.has(id)) expandedChars.delete(id);
  else expandedChars.add(id);
  renderCharacters();
}

async function copyCharPrompt(btn, charId) {
  const c = state.characters.find(x => x.id === charId);
  await navigator.clipboard.writeText(c.chatgpt_prompt || '');
  btn.classList.add('copied');
  btn.textContent = 'Copied ✓';
  setTimeout(() => { btn.classList.remove('copied'); btn.textContent = 'Copy'; }, 1500);
}

function uploadCharCandidate(charId, slotIndex) {
  pickFile(async (file) => {
    const key = await uploadFile(file);
    const c = state.characters.find(x => x.id === charId);
    let candidates = c.candidate_keys ? JSON.parse(c.candidate_keys) : ['','','',''];
    while (candidates.length < 4) candidates.push('');
    candidates[slotIndex] = key;
    c.candidate_keys = JSON.stringify(candidates);
    await fetch('/api/character/' + charId, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ candidate_keys: c.candidate_keys })
    });
    renderCharacters();
    showSaved();
  });
}

async function removeCharCandidate(charId, slotIndex) {
  const c = state.characters.find(x => x.id === charId);
  let candidates = c.candidate_keys ? JSON.parse(c.candidate_keys) : ['','','',''];
  candidates[slotIndex] = '';
  c.candidate_keys = JSON.stringify(candidates);
  await fetch('/api/character/' + charId, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ candidate_keys: c.candidate_keys })
  });
  renderCharacters();
  showSaved();
}

async function lockCharImage(charId, key) {
  const c = state.characters.find(x => x.id === charId);
  c.image_key = key;
  c.status = 'locked';
  await fetch('/api/character/' + charId, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ image_key: key, status: 'locked' })
  });
  renderCharacters();
  showSaved();
}

async function setCharStatus(id, status) {
  const c = state.characters.find(x => x.id === id);
  if (c) c.status = status;
  await fetch('/api/character/' + id, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ status })
  });
  renderCharacters();
  showSaved();
}

function renderShots() {
  const section = document.getElementById('shots-section');
  section.innerHTML = state.shots.map(s => renderShot(s)).join('');
}

function renderShot(s) {
  const candidates = s.candidate_keys ? JSON.parse(s.candidate_keys) : ['','',''];
  while (candidates.length < 3) candidates.push('');
  const aspectClass = s.aspect === '16:9' ? 'aspect-16-9' : '';
  const isExpanded = expandedShots.has(s.id);
  const typeClass = 'type-' + s.shot_type;

  return \`
  <div class="shot-card status-\${s.status} \${isExpanded?'expanded':''}" id="shot-\${s.id}"
       ondragenter="dragEnterShot(event, this)"
       ondragover="dragOver(event)"
       ondragleave="dragLeaveShot(event, this)"
       ondrop="dropOnShot(event, this, \${s.id})">
    <div class="shot-header" onclick="toggleShot(\${s.id})">
      <div class="shot-num">\${String(s.id).padStart(2,'0')}</div>
      <div class="shot-title-row">
        <div class="shot-title">\${escapeHtml(s.title)}</div>
        <div class="shot-meta">
          <span>\${s.time_code}</span>
          <span>\${s.aspect}</span>
          \${s.character_refs ? '<span>👤 ' + s.character_refs + '</span>' : ''}
          <span class="type-badge \${typeClass}">\${s.shot_type}</span>
        </div>
      </div>
      <div class="shot-status status-\${s.status}">\${s.status}</div>
      <div class="chevron">▾</div>
    </div>
    <div class="shot-body">
      <div class="shot-section">
        <div class="shot-section-label">Description</div>
        <div class="desc-text">\${escapeHtml(s.description || '')}</div>
      </div>

      \${s.chatgpt_prompt ? \`
        <div class="shot-section">
          <div class="shot-section-label">Flow Prompt</div>
          <div class="prompt-box">\${escapeHtml(s.chatgpt_prompt)}<button class="copy-btn" onclick="copyPrompt(this, \${s.id}, 'chatgpt')">Copy</button></div>
        </div>

        <div class="shot-section">
          <div class="shot-section-label">Image Candidates — drop or click to upload, ⭐ to mark winner</div>
          <div class="candidate-grid">
            \${candidates.map((key, i) => \`
              <div class="candidate-slot \${aspectClass} \${key && key === s.winner_image_key ? 'is-winner' : ''}"
                   onclick="uploadCandidate(\${s.id}, \${i})"
                   ondragenter="dragEnter(event, this)"
                   ondragover="dragOver(event)"
                   ondragleave="dragLeave(event, this)"
                   ondrop="dropOnCandidate(event, this, \${s.id}, \${i})">
                \${key
                  ? '<img src="/img/' + key + '" onclick="event.stopPropagation();openLightbox(\\''+key+'\\')">' +
                    (key === s.winner_image_key ? '<div class="winner-star">⭐ Winner</div>' : '') +
                    '<div class="candidate-actions">' +
                      '<button onclick="event.stopPropagation();markWinner(' + s.id + ',\\''+key+'\\')">Pick</button>' +
                      '<button onclick="event.stopPropagation();removeCandidate(' + s.id + ',' + i + ')">Remove</button>' +
                    '</div>'
                  : '<div class="placeholder">+ Drop or click<br><small>candidate ' + (i+1) + '</small></div>'}
              </div>
            \`).join('')}
          </div>
        </div>

        \${s.shot_type === 'scene' ? \`
          <div class="shot-section">
            <div class="shot-section-label">Optional Flow Frames — start frame & end frame for video generation</div>
            <div class="frame-grid">
              <div class="frame-slot \${aspectClass}"
                   onclick="uploadFrame(\${s.id}, 'start')"
                   ondragenter="dragEnter(event, this)"
                   ondragover="dragOver(event)"
                   ondragleave="dragLeave(event, this)"
                   ondrop="dropOnFrame(event, this, \${s.id}, 'start')">
                \${s.start_frame_key
                  ? '<img src="/img/' + s.start_frame_key + '" onclick="event.stopPropagation();openLightbox(\\''+s.start_frame_key+'\\')"><div class="frame-label">Start</div>'
                  : '<div class="placeholder">+ Drop or click<br><small>start frame (optional)</small></div>'}
              </div>
              <div class="frame-slot \${aspectClass}"
                   onclick="uploadFrame(\${s.id}, 'end')"
                   ondragenter="dragEnter(event, this)"
                   ondragover="dragOver(event)"
                   ondragleave="dragLeave(event, this)"
                   ondrop="dropOnFrame(event, this, \${s.id}, 'end')">
                \${s.end_frame_key
                  ? '<img src="/img/' + s.end_frame_key + '" onclick="event.stopPropagation();openLightbox(\\''+s.end_frame_key+'\\')"><div class="frame-label">End</div>'
                  : '<div class="placeholder">+ Drop or click<br><small>end frame (optional)</small></div>'}
              </div>
            </div>
          </div>

          <div class="shot-section">
            <div class="shot-section-label">Flow Motion Prompt — auto-generated, edit as needed</div>
            <div class="prompt-box" id="motion-\${s.id}">\${escapeHtml(buildMotionPrompt(s))}<button class="copy-btn" onclick="copyMotionPrompt(this, \${s.id})">Copy</button></div>
          </div>

          <div class="shot-section">
            <div class="shot-section-label">Video Generations — drop or click, ⭐ to mark winner</div>
            <div class="candidate-grid">
              \${(() => {
                const vids = s.video_candidate_keys ? JSON.parse(s.video_candidate_keys) : ['','',''];
                while (vids.length < 3) vids.push('');
                return vids.map((key, i) => \`
                  <div class="candidate-slot \${aspectClass} \${key && key === s.winner_video_key ? 'is-winner' : ''}"
                       onclick="uploadVideoCandidate(\${s.id}, \${i})"
                       ondragenter="dragEnter(event, this)"
                       ondragover="dragOver(event)"
                       ondragleave="dragLeave(event, this)"
                       ondrop="dropOnVideoCandidate(event, this, \${s.id}, \${i})">
                    \${key
                      ? '<video src="/img/' + key + '" muted loop playsinline preload="metadata" onmouseenter="this.play()" onmouseleave="this.pause();this.currentTime=0" onclick="event.stopPropagation();openVideoLightbox(\\''+key+'\\')"></video>' +
                        (key === s.winner_video_key ? '<div class="winner-star">⭐ Winner</div>' : '') +
                        '<div class="candidate-actions">' +
                          '<button onclick="event.stopPropagation();markVideoWinner(' + s.id + ',\\''+key+'\\')">Pick</button>' +
                          '<button onclick="event.stopPropagation();removeVideoCandidate(' + s.id + ',' + i + ')">Remove</button>' +
                        '</div>'
                      : '<div class="placeholder">+ Drop or click<br><small>video ' + (i+1) + '</small></div>'}
                  </div>
                \`).join('');
              })()}
            </div>
          </div>
        \` : ''}
      \` : ''}

      <div class="shot-section">
        <div class="shot-section-label">Notes</div>
        <textarea oninput="saveShot(\${s.id},'notes',this.value)">\${escapeHtml(s.notes || '')}</textarea>
      </div>

      <div class="shot-section">
        <div class="shot-section-label">Status</div>
        <div class="status-buttons">
          <button onclick="setStatus(\${s.id},'pending')" class="\${s.status==='pending'?'active':''}">Pending</button>
          <button onclick="setStatus(\${s.id},'generating')" class="\${s.status==='generating'?'active':''}">Generating</button>
          <button onclick="setStatus(\${s.id},'locked')" class="status-locked \${s.status==='locked'?'active':''}">Locked ✓</button>
        </div>
      </div>
    </div>
  </div>\`;
}

function buildMotionPrompt(s) {
  const motion = s.flow_motion_prompt || \`Subtle motion: gently falling snow drifting through the frame, soft camera push-in over 8 seconds, breath visible in the cold air, ambient bokeh light shimmer. Maintain exact watercolor storybook style and character appearance from the input image. No style drift. 8 second clip.\`;
  return motion;
}

const expandedShots = new Set();

function toggleShot(id) {
  if (expandedShots.has(id)) expandedShots.delete(id);
  else expandedShots.add(id);
  renderShots();
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function debouncedSave(key, fn) {
  clearTimeout(saveTimers[key]);
  saveTimers[key] = setTimeout(fn, 600);
}

async function saveShot(id, field, value) {
  const local = state.shots.find(s => s.id === id);
  if (local) local[field] = value;
  debouncedSave('shot-' + id + '-' + field, async () => {
    const body = {}; body[field] = value;
    await fetch('/api/shot/' + id, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    showSaved();
  });
}

async function saveCharacter(id, field, value) {
  const local = state.characters.find(c => c.id === id);
  if (local) local[field] = value;
  debouncedSave('char-' + id + '-' + field, async () => {
    const body = {}; body[field] = value;
    await fetch('/api/character/' + id, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    showSaved();
  });
}

async function setStatus(id, status) {
  await saveShot(id, 'status', status);
  const s = state.shots.find(x => x.id === id);
  if (s) s.status = status;
  renderShots();
  updateProgress();
}

async function copyPrompt(btn, shotId, kind) {
  const s = state.shots.find(x => x.id === shotId);
  const text = kind === 'chatgpt' ? s.chatgpt_prompt : buildMotionPrompt(s);
  await navigator.clipboard.writeText(text);
  btn.classList.add('copied');
  btn.textContent = 'Copied ✓';
  setTimeout(() => { btn.classList.remove('copied'); btn.textContent = 'Copy'; }, 1500);
}

async function copyMotionPrompt(btn, shotId) {
  const s = state.shots.find(x => x.id === shotId);
  await navigator.clipboard.writeText(buildMotionPrompt(s));
  btn.classList.add('copied');
  btn.textContent = 'Copied ✓';
  setTimeout(() => { btn.classList.remove('copied'); btn.textContent = 'Copy'; }, 1500);
}

function pickFile(callback) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/png,image/jpeg,image/webp';
  input.onchange = () => {
    if (input.files[0]) callback(input.files[0]);
  };
  input.click();
}

async function uploadFile(file) {
  const r = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: file
  });
  const d = await r.json();
  return d.key;
}

// ============================================================
// DRAG & DROP HELPERS
// ============================================================

function dragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'copy';
}

function dragEnter(e, el) {
  e.preventDefault();
  e.stopPropagation();
  // Only react to files
  if (!e.dataTransfer || !e.dataTransfer.types.includes('Files')) return;
  el.classList.add('drag-over');
}

function dragLeave(e, el) {
  e.preventDefault();
  e.stopPropagation();
  // Only remove if we actually left the element (not entered a child)
  if (!el.contains(e.relatedTarget)) {
    el.classList.remove('drag-over');
  }
}

function dragEnterShot(e, el) {
  if (!e.dataTransfer || !e.dataTransfer.types.includes('Files')) return;
  e.preventDefault();
  e.stopPropagation();
  el.classList.add('drop-active');
}

function dragLeaveShot(e, el) {
  e.preventDefault();
  e.stopPropagation();
  if (!el.contains(e.relatedTarget)) {
    el.classList.remove('drop-active');
  }
}

function getImageFiles(dt) {
  const files = [];
  if (!dt) return files;
  if (dt.items) {
    for (const item of dt.items) {
      if (item.kind === 'file') {
        const f = item.getAsFile();
        if (f && f.type.startsWith('image/')) files.push(f);
      }
    }
  } else if (dt.files) {
    for (const f of dt.files) {
      if (f.type.startsWith('image/')) files.push(f);
    }
  }
  return files;
}

async function dropOnCandidate(e, el, shotId, slotIndex) {
  e.preventDefault();
  e.stopPropagation();
  el.classList.remove('drag-over');
  const files = getImageFiles(e.dataTransfer);
  if (!files.length) return;

  const s = state.shots.find(x => x.id === shotId);
  let candidates = s.candidate_keys ? JSON.parse(s.candidate_keys) : ['','',''];
  while (candidates.length < 3) candidates.push('');

  // First file goes to the slot dropped on; additional files fill subsequent empty slots
  let targetSlot = slotIndex;
  for (let i = 0; i < files.length && targetSlot < 3; i++) {
    const key = await uploadFile(files[i]);
    candidates[targetSlot] = key;
    targetSlot++;
    // Skip slots that are already filled (unless this is the slot we dropped on, which we always overwrite)
    while (targetSlot < 3 && candidates[targetSlot] && i + 1 < files.length) targetSlot++;
  }

  s.candidate_keys = JSON.stringify(candidates);
  await fetch('/api/shot/' + shotId, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ candidate_keys: s.candidate_keys })
  });
  renderShots();
  showSaved();
}

async function dropOnShot(e, el, shotId) {
  e.preventDefault();
  e.stopPropagation();
  el.classList.remove('drop-active');
  const files = getImageFiles(e.dataTransfer);
  if (!files.length) return;

  const s = state.shots.find(x => x.id === shotId);
  let candidates = s.candidate_keys ? JSON.parse(s.candidate_keys) : ['','',''];
  while (candidates.length < 3) candidates.push('');

  // Fill empty slots first; if none empty, replace from slot 0
  for (const file of files) {
    let targetSlot = candidates.findIndex(k => !k);
    if (targetSlot === -1) break; // all 3 filled
    const key = await uploadFile(file);
    candidates[targetSlot] = key;
  }

  s.candidate_keys = JSON.stringify(candidates);
  await fetch('/api/shot/' + shotId, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ candidate_keys: s.candidate_keys })
  });
  // Auto-expand the shot if not already
  if (!expandedShots.has(shotId)) expandedShots.add(shotId);
  renderShots();
  showSaved();
}

async function dropOnFrame(e, el, shotId, which) {
  e.preventDefault();
  e.stopPropagation();
  el.classList.remove('drag-over');
  const files = getImageFiles(e.dataTransfer);
  if (!files.length) return;
  const key = await uploadFile(files[0]);
  const field = which === 'start' ? 'start_frame_key' : 'end_frame_key';
  const s = state.shots.find(x => x.id === shotId);
  s[field] = key;
  const body = {}; body[field] = key;
  await fetch('/api/shot/' + shotId, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  renderShots();
  showSaved();
}

async function dropOnCharCandidate(e, el, charId, slotIndex) {
  e.preventDefault();
  e.stopPropagation();
  el.classList.remove('drag-over');
  const files = getImageFiles(e.dataTransfer);
  if (!files.length) return;

  const c = state.characters.find(x => x.id === charId);
  let candidates = c.candidate_keys ? JSON.parse(c.candidate_keys) : ['','','',''];
  while (candidates.length < 4) candidates.push('');

  let targetSlot = slotIndex;
  for (let i = 0; i < files.length && targetSlot < 4; i++) {
    const key = await uploadFile(files[i]);
    candidates[targetSlot] = key;
    targetSlot++;
    while (targetSlot < 4 && candidates[targetSlot] && i + 1 < files.length) targetSlot++;
  }

  c.candidate_keys = JSON.stringify(candidates);
  await fetch('/api/character/' + charId, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ candidate_keys: c.candidate_keys })
  });
  renderCharacters();
  showSaved();
}

// ===== VIDEO HANDLING =====

function pickVideoFile(callback) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/mp4,video/quicktime,video/webm,video/*';
  input.onchange = () => {
    if (input.files[0]) callback(input.files[0]);
  };
  input.click();
}

function getVideoFiles(dt) {
  const files = [];
  if (!dt) return files;
  if (dt.items) {
    for (const item of dt.items) {
      if (item.kind === 'file') {
        const f = item.getAsFile();
        if (f && f.type.startsWith('video/')) files.push(f);
      }
    }
  } else if (dt.files) {
    for (const f of dt.files) {
      if (f.type.startsWith('video/')) files.push(f);
    }
  }
  return files;
}

async function uploadVideoCandidate(shotId, slotIndex) {
  pickVideoFile(async (file) => {
    const key = await uploadFile(file);
    const s = state.shots.find(x => x.id === shotId);
    let videos = s.video_candidate_keys ? JSON.parse(s.video_candidate_keys) : ['','',''];
    while (videos.length < 3) videos.push('');
    videos[slotIndex] = key;
    s.video_candidate_keys = JSON.stringify(videos);
    await fetch('/api/shot/' + shotId, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ video_candidate_keys: s.video_candidate_keys })
    });
    renderShots();
    showSaved();
  });
}

async function dropOnVideoCandidate(e, el, shotId, slotIndex) {
  e.preventDefault();
  e.stopPropagation();
  el.classList.remove('drag-over');
  const files = getVideoFiles(e.dataTransfer);
  if (!files.length) return;

  const s = state.shots.find(x => x.id === shotId);
  let videos = s.video_candidate_keys ? JSON.parse(s.video_candidate_keys) : ['','',''];
  while (videos.length < 3) videos.push('');

  let targetSlot = slotIndex;
  for (let i = 0; i < files.length && targetSlot < 3; i++) {
    const key = await uploadFile(files[i]);
    videos[targetSlot] = key;
    targetSlot++;
    while (targetSlot < 3 && videos[targetSlot] && i + 1 < files.length) targetSlot++;
  }

  s.video_candidate_keys = JSON.stringify(videos);
  await fetch('/api/shot/' + shotId, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ video_candidate_keys: s.video_candidate_keys })
  });
  renderShots();
  showSaved();
}

async function removeVideoCandidate(shotId, slotIndex) {
  const s = state.shots.find(x => x.id === shotId);
  let videos = s.video_candidate_keys ? JSON.parse(s.video_candidate_keys) : ['','',''];
  videos[slotIndex] = '';
  s.video_candidate_keys = JSON.stringify(videos);
  await fetch('/api/shot/' + shotId, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ video_candidate_keys: s.video_candidate_keys })
  });
  renderShots();
  showSaved();
}

async function markVideoWinner(shotId, key) {
  const s = state.shots.find(x => x.id === shotId);
  s.winner_video_key = key;
  await fetch('/api/shot/' + shotId, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ winner_video_key: key })
  });
  renderShots();
  showSaved();
}

function openVideoLightbox(key) {
  const lb = document.getElementById('lightbox');
  // swap content with video
  const old = lb.querySelector('img, video');
  if (old) old.remove();
  const v = document.createElement('video');
  v.src = '/img/' + key;
  v.controls = true;
  v.autoplay = true;
  v.style.maxWidth = '100%';
  v.style.maxHeight = '100%';
  lb.appendChild(v);
  lb.classList.add('show');
}

// Prevent the default browser behavior of opening images dropped outside drop zones
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', (e) => {
  // Only prevent default if not over a designated drop zone
  if (!e.target.closest('.candidate-slot, .frame-slot, .shot-card, .ref-card, .ref-add-card, .char-locked-thumb')) {
    e.preventDefault();
  }
});

function uploadCharacterImage(charId) {
  pickFile(async (file) => {
    const key = await uploadFile(file);
    await fetch('/api/character/' + charId, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ image_key: key })
    });
    const c = state.characters.find(x => x.id === charId);
    if (c) c.image_key = key;
    renderCharacters();
    showSaved();
  });
}

function uploadCandidate(shotId, slotIndex) {
  pickFile(async (file) => {
    const key = await uploadFile(file);
    const s = state.shots.find(x => x.id === shotId);
    let candidates = s.candidate_keys ? JSON.parse(s.candidate_keys) : ['','',''];
    while (candidates.length < 3) candidates.push('');
    candidates[slotIndex] = key;
    s.candidate_keys = JSON.stringify(candidates);
    await fetch('/api/shot/' + shotId, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ candidate_keys: s.candidate_keys })
    });
    renderShots();
    showSaved();
  });
}

async function removeCandidate(shotId, slotIndex) {
  const s = state.shots.find(x => x.id === shotId);
  let candidates = s.candidate_keys ? JSON.parse(s.candidate_keys) : ['','',''];
  candidates[slotIndex] = '';
  s.candidate_keys = JSON.stringify(candidates);
  await fetch('/api/shot/' + shotId, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ candidate_keys: s.candidate_keys })
  });
  renderShots();
  showSaved();
}

async function markWinner(shotId, key) {
  const s = state.shots.find(x => x.id === shotId);
  s.winner_image_key = key;
  await fetch('/api/shot/' + shotId, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ winner_image_key: key })
  });
  renderShots();
  showSaved();
}

function uploadFrame(shotId, which) {
  pickFile(async (file) => {
    const key = await uploadFile(file);
    const field = which === 'start' ? 'start_frame_key' : 'end_frame_key';
    const s = state.shots.find(x => x.id === shotId);
    s[field] = key;
    const body = {};
    body[field] = key;
    await fetch('/api/shot/' + shotId, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    renderShots();
    showSaved();
  });
}

function openLightbox(key) {
  const lb = document.getElementById('lightbox');
  // Remove any existing video
  const oldVid = lb.querySelector('video');
  if (oldVid) { oldVid.pause(); oldVid.remove(); }
  // Restore img
  let img = lb.querySelector('img');
  if (!img) {
    img = document.createElement('img');
    img.id = 'lightbox-img';
    lb.appendChild(img);
  }
  img.style.display = '';
  img.src = '/img/' + key;
  lb.classList.add('show');
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('show');
  const v = lb.querySelector('video');
  if (v) { v.pause(); v.remove(); }
  const img = lb.querySelector('img');
  if (img) img.src = '';
}

async function logout() {
  await fetch('/auth/logout', { method: 'POST' });
  location.href = '/';
}

loadState();
</script>
</body>
</html>`;

const BOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lunch Angels — Storyboard</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@400;500;600&display=swap');
*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
:root {
  --paper: #faf6ee;
  --paper-2: #f3ecdb;
  --ink: #2a2620;
  --ink-soft: #4a4138;
  --muted: #8a7a5a;
  --rule: #d6c9a8;
  --red: #8b1a1a;
  --gold: #d4a55d;
  --shadow: rgba(58,34,18,0.10);
}
html,body { background: var(--paper); color: var(--ink); font-family: 'Inter', -apple-system, sans-serif; min-height: 100vh; }
body {
  background-image:
    radial-gradient(circle at 10% 5%, rgba(139,26,26,0.025), transparent 35%),
    radial-gradient(circle at 90% 95%, rgba(212,165,93,0.04), transparent 50%);
}

/* Cover screen */
.cover {
  position: fixed;
  inset: 0;
  background: var(--paper);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 50;
  transition: opacity .5s, visibility .5s;
  padding: 40px;
  text-align: center;
}
.cover.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
.cover-eyebrow { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 20px; }
.cover-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(56px, 12vw, 120px);
  font-weight: 400;
  color: var(--red);
  letter-spacing: -2px;
  line-height: 1;
  margin-bottom: 16px;
}
.cover-sub { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(18px, 2vw, 24px); color: var(--ink-soft); margin-bottom: 8px; }
.cover-meta { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 48px; }
.cover-cta {
  background: var(--red);
  color: var(--paper);
  border: none;
  padding: 16px 36px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background .2s;
}
.cover-cta:hover { background: #6f1414; }
.cover-foot { position: absolute; bottom: 32px; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }

/* Top toolbar */
.toolbar {
  position: sticky;
  top: 0;
  background: rgba(250,246,238,0.94);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--rule);
  z-index: 30;
  padding: 14px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.toolbar h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 500;
  color: var(--red);
  letter-spacing: -0.5px;
}
.toolbar h1 .sub {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 500;
  margin-top: 2px;
}
.toolbar-right { display: flex; gap: 10px; align-items: center; font-size: 12px; }
.toolbar-right a {
  background: transparent;
  border: 1px solid var(--rule);
  color: var(--ink-soft);
  padding: 7px 12px;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
}
.toolbar-right a:hover { border-color: var(--red); color: var(--red); }

/* Main content - vertical scroll deck */
.deck {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 32px 96px;
}

/* Act divider */
.act-divider {
  text-align: center;
  margin: 80px 0 56px;
  padding: 0 16px;
}
.act-divider:first-child { margin-top: 0; }
.act-divider .num {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 14px;
  letter-spacing: 2px;
  color: var(--muted);
  margin-bottom: 8px;
  display: block;
}
.act-divider .title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 44px;
  font-weight: 400;
  color: var(--red);
  letter-spacing: -1px;
  line-height: 1;
}
.act-divider .rule {
  width: 64px;
  height: 1px;
  background: var(--red);
  margin: 24px auto 0;
}

/* Shot — full presentation card */
.shot {
  margin-bottom: 96px;
  background: rgba(255,255,255,0.55);
  border: 1px solid var(--rule);
  overflow: hidden;
  position: relative;
}
.shot-image {
  width: 100%;
  aspect-ratio: 3/2;
  background: var(--paper-2);
  position: relative;
  overflow: hidden;
}
.shot-image img, .shot-image video { width: 100%; height: 100%; object-fit: cover; display: block; cursor: pointer; }
.shot-image-placeholder {
  width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
  padding: 32px;
  gap: 12px;
  background: repeating-linear-gradient(135deg, transparent 0, transparent 12px, rgba(214,201,168,0.18) 12px, rgba(214,201,168,0.18) 13px);
}
.shot-image-placeholder svg { opacity: .35; width: 40px; height: 40px; }
.shot-image-placeholder span:last-child { font-size: 11px; letter-spacing: 0; text-transform: none; color: var(--muted); }

.shot-num-overlay {
  position: absolute;
  top: 18px;
  left: 24px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 56px;
  font-weight: 400;
  color: var(--paper);
  text-shadow: 0 2px 16px rgba(0,0,0,0.6);
  line-height: 1;
}
.shot-time-overlay {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(0,0,0,0.6);
  color: var(--paper);
  padding: 6px 14px;
  font-size: 11px;
  letter-spacing: 1.5px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.shot-type-overlay {
  position: absolute;
  bottom: 18px;
  left: 24px;
  background: rgba(255,255,255,0.95);
  color: var(--ink);
  padding: 5px 12px;
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 600;
}
.shot-type-overlay.broll { background: var(--gold); color: var(--paper); }
.shot-type-overlay.comp { background: var(--ink-soft); color: var(--paper); }
.shot-type-overlay.audio { background: var(--red); color: var(--paper); }

/* Body content below the image */
.shot-body {
  padding: 40px 48px 48px;
}
.shot-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 38px;
  font-weight: 500;
  color: var(--ink);
  letter-spacing: -0.5px;
  line-height: 1.1;
  margin-bottom: 20px;
}
.shot-desc {
  font-family: 'Cormorant Garamond', serif;
  font-size: 19px;
  line-height: 1.5;
  color: var(--ink-soft);
  font-style: italic;
  margin-bottom: 32px;
  max-width: 720px;
}

.shot-block {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px dashed var(--rule);
}
.shot-block-label {
  font-size: 10px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--red);
  font-weight: 600;
  margin-bottom: 12px;
}
.shot-vo-quote {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 22px;
  line-height: 1.4;
  color: var(--ink);
  max-width: 720px;
}
.shot-vo-attribution {
  margin-top: 8px;
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 500;
}
.shot-direction {
  font-size: 14px;
  line-height: 1.65;
  color: var(--ink-soft);
  white-space: pre-wrap;
  max-width: 720px;
}

/* Video section */
.video-section { margin-top: 28px; padding-top: 24px; border-top: 1px dashed var(--rule); }
.video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 16px;
}
@media (max-width: 700px) { .video-grid { grid-template-columns: 1fr; } }
.video-slot {
  aspect-ratio: 3/2;
  background: var(--paper-2);
  border: 2px dashed var(--rule);
  cursor: pointer;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color .15s, background .15s;
}
.video-slot.drag-over { border-color: var(--red); background: rgba(139,26,26,0.08); border-style: solid; }
.video-slot:hover { border-color: var(--red); }
.video-slot.is-winner { border: 3px solid var(--red); border-style: solid; }
.video-slot video { width: 100%; height: 100%; object-fit: cover; background: #000; }
.video-slot .placeholder { text-align: center; color: var(--muted); font-size: 12px; padding: 12px; line-height: 1.4; }
.video-slot .placeholder small { font-size: 10px; opacity: 0.7; }
.video-slot .winner-star {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--red);
  color: var(--paper);
  font-size: 10px;
  padding: 4px 8px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  z-index: 2;
}
.video-slot .video-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(0deg, rgba(0,0,0,0.7), transparent);
  padding: 12px 8px 8px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity .15s;
  z-index: 2;
}
.video-slot:hover .video-actions { opacity: 1; }
.video-actions button {
  flex: 1;
  background: rgba(255,255,255,0.92);
  border: none;
  padding: 6px 8px;
  font-size: 10px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-family: inherit;
  cursor: pointer;
  color: var(--ink);
}
.video-actions button:hover { background: var(--red); color: var(--paper); }

.winner-video-banner {
  margin-top: 16px;
  background: rgba(139,26,26,0.06);
  border-left: 3px solid var(--red);
  padding: 12px 16px;
  font-size: 13px;
  color: var(--ink-soft);
  display: flex;
  align-items: center;
  gap: 10px;
}
.winner-video-banner strong { color: var(--red); font-weight: 600; }

/* End card */
.end-card {
  margin-top: 96px;
  padding: 96px 48px;
  text-align: center;
  background: linear-gradient(180deg, rgba(139,26,26,0.04), rgba(212,165,93,0.04));
  border: 1px solid var(--rule);
}
.end-eyebrow { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 20px; }
.end-title { font-family: 'Cormorant Garamond', serif; font-size: 64px; font-weight: 400; color: var(--red); letter-spacing: -1px; margin-bottom: 12px; line-height: 1; }
.end-sub { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 22px; color: var(--ink-soft); margin-bottom: 32px; }
.end-prose { font-size: 16px; line-height: 1.6; color: var(--ink-soft); max-width: 480px; margin: 0 auto; }
.end-prose em { font-family: 'Cormorant Garamond', serif; font-size: 18px; }
.end-stat { font-size: 12px; color: var(--muted); letter-spacing: 1px; margin-top: 32px; font-variant-numeric: tabular-nums; }

/* ============================================================
   EDITABLE FIELDS — inline contenteditable styling
   ============================================================ */
.editable {
  position: relative;
  outline: none;
  transition: background-color .15s, box-shadow .15s;
  border-radius: 2px;
  cursor: text;
}
.editable:hover {
  background-color: rgba(212,165,93,0.08);
  box-shadow: 0 0 0 6px rgba(212,165,93,0.08);
}
.editable:hover::after {
  content: '✎ click to edit';
  position: absolute;
  top: -22px;
  right: 0;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  background: var(--paper);
  padding: 3px 8px;
  border: 1px solid var(--rule);
  pointer-events: none;
  white-space: nowrap;
  z-index: 5;
}
.editable:focus {
  background-color: rgba(212,165,93,0.12);
  box-shadow: 0 0 0 2px var(--gold);
}
.editable:focus::after { display: none; }
.editable.saving { box-shadow: 0 0 0 2px var(--muted); }
.editable.saved {
  background-color: rgba(212,165,93,0.25);
  box-shadow: 0 0 0 2px var(--gold);
  transition: background-color .8s, box-shadow .8s;
}
.editable.save-error { box-shadow: 0 0 0 2px var(--red); }
.editable.is-empty:empty::before,
.editable.is-empty::before {
  content: attr(data-empty-text);
  color: var(--muted);
  font-style: italic;
  opacity: 0.6;
}
.editable.is-empty { min-height: 1.5em; }
.shot-vo-quote.editable:not(:focus):empty {
  font-style: italic;
  opacity: 0.55;
}
.shot-vo-quote.editable:not(:focus):empty::before {
  content: attr(data-empty-text);
}
.shot-direction.editable {
  min-height: 1.6em;
  padding: 4px 6px;
  margin-left: -6px;
}
.shot-title.editable { padding: 2px 6px; margin-left: -6px; }
.shot-desc.editable { padding: 4px 6px; margin-left: -6px; }
.shot-vo-quote.editable { padding: 4px 6px; margin-left: -6px; }
.shot-vo-attribution.editable { padding: 2px 6px; margin-left: -6px; display: inline-block; }

/* ============================================================
   COMMENTS THREAD
   ============================================================ */
.comments-block {
  background: rgba(212,165,93,0.05);
  margin-left: -16px;
  margin-right: -16px;
  padding: 24px 16px;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  border-radius: 0;
}
.comments-list {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.comment {
  background: var(--paper);
  border: 1px solid var(--rule);
  padding: 12px 14px;
  border-radius: 2px;
  font-size: 14px;
  line-height: 1.5;
}
.comment.mine {
  background: rgba(139,26,26,0.04);
  border-color: rgba(139,26,26,0.25);
}
.comment-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
  font-size: 11px;
  letter-spacing: 0.5px;
}
.comment-author {
  color: var(--ink);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
.comment.mine .comment-author { color: var(--red); }
.comment-time { color: var(--muted); margin-left: auto; font-variant-numeric: tabular-nums; }
.comment-delete {
  background: transparent;
  border: none;
  color: var(--muted);
  font-family: inherit;
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  padding: 2px 6px;
  margin-left: 4px;
}
.comment-delete:hover { color: var(--red); }
.comment-body {
  color: var(--ink-soft);
  white-space: pre-wrap;
  word-wrap: break-word;
}
.comment-composer {
  display: flex;
  gap: 8px;
  align-items: stretch;
}
.comment-composer textarea {
  flex: 1;
  background: var(--paper);
  border: 1px solid var(--rule);
  padding: 10px 12px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink);
  resize: vertical;
  min-height: 60px;
  border-radius: 2px;
  transition: border-color .15s;
}
.comment-composer textarea:focus {
  outline: none;
  border-color: var(--red);
}
.comment-composer button {
  background: var(--red);
  color: var(--paper);
  border: none;
  padding: 0 18px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background .15s;
  align-self: stretch;
}
.comment-composer button:hover { background: #6f1414; }
.comment-composer button:disabled { background: var(--muted); cursor: not-allowed; }

/* Lightbox */
.lightbox { position: fixed; inset: 0; background: rgba(20,16,12,0.94); z-index: 100; display: none; align-items: center; justify-content: center; padding: 24px; cursor: pointer; }
.lightbox.show { display: flex; }
.lightbox img, .lightbox video { max-width: 100%; max-height: 100%; object-fit: contain; }
.lightbox-close { position: absolute; top: 24px; right: 24px; background: transparent; color: var(--paper); border: 1px solid var(--paper); padding: 8px 16px; font-family: inherit; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; }

@media (max-width: 700px) {
  .toolbar { padding: 12px 16px; }
  .toolbar h1 { font-size: 17px; }
  .deck { padding: 24px 16px 64px; }
  .act-divider .title { font-size: 32px; }
  .shot-body { padding: 28px 24px 32px; }
  .shot-title { font-size: 28px; }
  .shot-desc { font-size: 16px; }
  .shot-vo-quote { font-size: 18px; }
  .end-title { font-size: 44px; }
  .shot-num-overlay { font-size: 40px; top: 14px; left: 16px; }
  .shot-time-overlay { top: 16px; right: 16px; padding: 4px 10px; }
}
</style>
</head>
<body>

<div class="cover" id="cover">
  <div class="cover-eyebrow">Davis Education Foundation • Gala 2026</div>
  <div class="cover-title">Lunch Angels</div>
  <div class="cover-sub">"Let's get two."</div>
  <div class="cover-meta">A Visual Storyboard</div>
  <button class="cover-cta" onclick="document.getElementById('cover').classList.add('hidden')">Begin →</button>
  <div class="cover-foot">Scroll down to walk through the film</div>
</div>

<div class="toolbar">
  <h1>Lunch Angels<span class="sub">Visual Storyboard · DEF Gala 2026</span></h1>
  <div class="toolbar-right">
    <a href="/">Production view</a>
  </div>
</div>

<div class="deck" id="deck">
  <div style="padding:80px 20px;color:var(--muted);font-size:13px;text-align:center;">Loading…</div>
</div>

<div class="lightbox" id="lightbox" onclick="closeLightbox()">
  <button class="lightbox-close">Close ×</button>
</div>

<script>
const ACTS = [
  { num: "Act I", title: "The Man's Story", first: 1, last: 13 },
  { num: "Act II", title: "Then to Now", first: 14, last: 14 },
  { num: "Act III", title: "Mateo's Story", first: 15, last: 21 },
  { num: "Act IV", title: "The Ask", first: 22, last: 22 }
];

let state = { shots: [] };

async function loadState() {
  const r = await fetch('/api/state');
  if (!r.ok) { location.href = '/'; return; }
  state = await r.json();
  render();
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function render() {
  const deck = document.getElementById('deck');
  let html = '';
  for (const act of ACTS) {
    html += \`
      <div class="act-divider">
        <span class="num">\${act.num}</span>
        <div class="title">\${act.title}</div>
        <div class="rule"></div>
      </div>\`;
    for (let id = act.first; id <= act.last; id++) {
      const s = state.shots.find(x => x.id === id);
      if (!s) continue;
      html += renderShot(s);
    }
  }
  html += renderEndCard();
  deck.innerHTML = html;
}

function renderShot(s) {
  const winnerImg = s.winner_image_key;
  const winnerVid = s.winner_video_key;
  const voQuote = s.vo_quote || '';
  const voWho = s.vo_who || '';
  const typeClass = s.shot_type;

  // Top image/video — winner video takes precedence over image if present
  let topMedia;
  if (winnerVid) {
    topMedia = '<video src="/img/' + winnerVid + '" controls preload="metadata" poster="' + (winnerImg ? '/img/' + winnerImg : '') + '"></video>';
  } else if (winnerImg) {
    topMedia = '<img src="/img/' + winnerImg + '" alt="' + escapeHtml(s.title) + '" onclick="openLightbox(\\''+winnerImg+'\\')">';
  } else if (s.shot_type === 'broll') {
    topMedia = '<div class="shot-image-placeholder">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="13" rx="1"/><path d="M7 6V4a2 2 0 012-2h6a2 2 0 012 2v2"/><circle cx="12" cy="13" r="3"/></svg>' +
      '<span>Live B-Roll</span><span>Pull from DEF Communications archive</span></div>';
  } else if (s.shot_type === 'comp') {
    topMedia = '<div class="shot-image-placeholder">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7V5a2 2 0 012-2h2M16 3h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2"/><line x1="9" y1="12" x2="15" y2="12"/></svg>' +
      '<span>Typography Composite</span><span>Built in Premiere or After Effects</span></div>';
  } else if (s.shot_type === 'audio') {
    topMedia = '<div class="shot-image-placeholder" style="background:var(--ink);color:var(--paper);">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="6" y1="3" x2="6" y2="21"/><line x1="18" y1="3" x2="18" y2="21"/><line x1="2" y1="9" x2="6" y2="9"/><line x1="2" y1="15" x2="6" y2="15"/><line x1="18" y1="9" x2="22" y2="9"/><line x1="18" y1="15" x2="22" y2="15"/></svg>' +
      '<span style="color:var(--paper);">Black Screen</span><span style="color:var(--gold);">Audio only — no image</span></div>';
  } else {
    topMedia = '<div class="shot-image-placeholder">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' +
      '<span>Scene Pending</span><span>Generation in progress</span></div>';
  }

  // EDITABLE V.O. block — always shown so people can add a V.O. where there isn't one
  const voBlock = \`
    <div class="shot-block">
      <div class="shot-block-label">Voice Over</div>
      <div class="shot-vo-quote editable"
           contenteditable="true"
           data-field="vo_quote"
           data-shot="\${s.id}"
           data-empty-text='"Click to add voice-over line..."'
           onblur="saveBoardField(this)"
           onkeydown="handleEditKey(event, this)">\${voQuote ? '"' + escapeHtml(voQuote) + '"' : ''}</div>
      <div class="shot-vo-attribution editable \${voWho ? '' : 'is-empty'}"
           contenteditable="true"
           data-field="vo_who"
           data-shot="\${s.id}"
           data-empty-text="— Speaker (click to add)"
           onblur="saveBoardField(this)"
           onkeydown="handleEditKey(event, this)">\${voWho ? '— ' + escapeHtml(voWho) : ''}</div>
    </div>\`;

  // EDITABLE direction notes
  const directionBlock = \`
    <div class="shot-block">
      <div class="shot-block-label">Direction Notes</div>
      <div class="shot-direction editable \${s.notes ? '' : 'is-empty'}"
           contenteditable="true"
           data-field="notes"
           data-shot="\${s.id}"
           data-empty-text="Click to add direction notes..."
           onblur="saveBoardField(this)">\${escapeHtml(s.notes || '')}</div>
    </div>\`;

  // Video candidates section
  let videoBlock = '';
  if (s.shot_type === 'scene') {
    const vids = s.video_candidate_keys ? JSON.parse(s.video_candidate_keys) : ['','',''];
    while (vids.length < 3) vids.push('');
    const hasAny = vids.some(v => v);
    videoBlock = \`
      <div class="video-section">
        <div class="shot-block-label">Video Generations</div>
        <p style="font-size:13px;color:var(--muted);margin-bottom:14px;line-height:1.5;">\${hasAny ? 'Drop or click to add more variations. Hover to play. Click ⭐ to mark the winner — it replaces the still image at the top of this shot.' : 'No videos yet. Drop your Flow generations here, then pick the best one.'}</p>
        <div class="video-grid">
          \${vids.map((key, i) => \`
            <div class="video-slot \${key && key === winnerVid ? 'is-winner' : ''}"
                 onclick="uploadVideoCandidate(\${s.id}, \${i})"
                 ondragenter="dragEnter(event, this)"
                 ondragover="dragOver(event)"
                 ondragleave="dragLeave(event, this)"
                 ondrop="dropOnVideoCandidate(event, this, \${s.id}, \${i})">
              \${key
                ? '<video src="/img/' + key + '" muted loop playsinline preload="metadata" onmouseenter="this.play()" onmouseleave="this.pause();this.currentTime=0" onclick="event.stopPropagation();openLightboxVideo(\\''+key+'\\')"></video>' +
                  (key === winnerVid ? '<div class="winner-star">⭐ Winner</div>' : '') +
                  '<div class="video-actions">' +
                    '<button onclick="event.stopPropagation();markVideoWinner(' + s.id + ',\\''+key+'\\')">Pick</button>' +
                    '<button onclick="event.stopPropagation();removeVideoCandidate(' + s.id + ',' + i + ')">Remove</button>' +
                  '</div>'
                : '<div class="placeholder">+ Drop or click<br><small>variant ' + (i+1) + '</small></div>'}
            </div>
          \`).join('')}
        </div>
      </div>\`;
  }

  // Comments thread
  const shotComments = (state.comments || []).filter(c => c.shot_id === s.id);
  const commentsBlock = \`
    <div class="shot-block comments-block">
      <div class="shot-block-label">Notes &amp; Feedback (\${shotComments.length})</div>
      <div class="comments-list" id="comments-\${s.id}">
        \${shotComments.map(c => renderComment(c)).join('') || '<div style="font-size:13px;color:var(--muted);font-style:italic;">No comments yet. Add the first one below.</div>'}
      </div>
      <div class="comment-composer">
        <textarea
          id="composer-\${s.id}"
          placeholder="Leave a note for Scott or Kara..."
          onkeydown="if(event.key==='Enter'&&(event.metaKey||event.ctrlKey))postComment(\${s.id})"></textarea>
        <button onclick="postComment(\${s.id})">Post</button>
      </div>
    </div>\`;

  return \`
  <div class="shot" id="shot-\${s.id}">
    <div class="shot-image">
      \${topMedia}
      <div class="shot-num-overlay">\${String(s.id).padStart(2,'0')}</div>
      <div class="shot-time-overlay">\${s.time_code || ''}</div>
      <div class="shot-type-overlay \${typeClass}">\${s.shot_type}</div>
    </div>
    <div class="shot-body">
      <div class="shot-title editable"
           contenteditable="true"
           data-field="title"
           data-shot="\${s.id}"
           onblur="saveBoardField(this)"
           onkeydown="handleEditKey(event, this)">\${escapeHtml(s.title)}</div>
      <div class="shot-desc editable \${s.description ? '' : 'is-empty'}"
           contenteditable="true"
           data-field="description"
           data-shot="\${s.id}"
           data-empty-text="Click to add description..."
           onblur="saveBoardField(this)">\${escapeHtml(s.description || '')}</div>
      \${voBlock}
      \${directionBlock}
      \${videoBlock}
      \${commentsBlock}
    </div>
  </div>\`;
}

function renderComment(c) {
  const ts = new Date(c.created_at);
  const timeStr = ts.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const myEmail = state.email;
  const isMine = c.email === myEmail;
  const author = c.email.split('@')[0];
  return \`
    <div class="comment \${isMine ? 'mine' : ''}">
      <div class="comment-meta">
        <span class="comment-author">\${escapeHtml(author)}</span>
        <span class="comment-time">\${timeStr}</span>
        \${isMine ? '<button class="comment-delete" onclick="deleteComment(' + c.id + ')">Delete</button>' : ''}
      </div>
      <div class="comment-body">\${escapeHtml(c.body)}</div>
    </div>\`;
}

async function saveBoardField(el) {
  const field = el.dataset.field;
  const shotId = parseInt(el.dataset.shot);
  let value = el.innerText.trim();

  // Strip the wrapping quotes for vo_quote since we display them but don't store them
  if (field === 'vo_quote' && value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
  }
  // Strip the leading "— " for vo_who
  if (field === 'vo_who' && value.startsWith('— ')) {
    value = value.slice(2);
  }

  const s = state.shots.find(x => x.id === shotId);
  if (!s) return;
  if (s[field] === value) return; // No change

  s[field] = value;
  el.classList.toggle('is-empty', !value);

  // Visual save flash
  el.classList.add('saving');

  try {
    const body = {}; body[field] = value;
    const r = await fetch('/api/shot/' + shotId, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    if (r.ok) {
      el.classList.remove('saving');
      el.classList.add('saved');
      setTimeout(() => el.classList.remove('saved'), 800);
    }
  } catch (e) {
    el.classList.remove('saving');
    el.classList.add('save-error');
    setTimeout(() => el.classList.remove('save-error'), 2000);
  }
}

function handleEditKey(e, el) {
  // Single-line fields: Enter blurs (saves)
  if (el.dataset.field === 'title' || el.dataset.field === 'vo_who') {
    if (e.key === 'Enter') {
      e.preventDefault();
      el.blur();
    }
  }
  // Esc cancels and reverts
  if (e.key === 'Escape') {
    el.blur();
  }
}

async function postComment(shotId) {
  const ta = document.getElementById('composer-' + shotId);
  const body = ta.value.trim();
  if (!body) return;
  ta.disabled = true;
  try {
    const r = await fetch('/api/comment', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ shot_id: shotId, body })
    });
    const d = await r.json();
    if (d.ok) {
      // Optimistic add to local state, then re-render only the comments list for this shot
      state.comments = state.comments || [];
      state.comments.push({
        id: d.id,
        shot_id: shotId,
        email: state.email,
        body: body,
        created_at: Date.now()
      });
      ta.value = '';
      // Patch only the comments block to avoid losing edit cursor on other fields
      patchCommentsList(shotId);
    }
  } finally {
    ta.disabled = false;
    ta.focus();
  }
}

async function deleteComment(commentId) {
  if (!confirm('Delete this comment?')) return;
  const r = await fetch('/api/comment/' + commentId, { method: 'DELETE' });
  if (r.ok) {
    const c = (state.comments || []).find(x => x.id === commentId);
    state.comments = (state.comments || []).filter(x => x.id !== commentId);
    if (c) patchCommentsList(c.shot_id);
  }
}

function patchCommentsList(shotId) {
  const list = document.getElementById('comments-' + shotId);
  if (!list) return;
  const shotComments = (state.comments || []).filter(c => c.shot_id === shotId);
  list.innerHTML = shotComments.map(c => renderComment(c)).join('') || '<div style="font-size:13px;color:var(--muted);font-style:italic;">No comments yet. Add the first one below.</div>';
  // Update header count
  const block = list.closest('.comments-block');
  if (block) {
    const label = block.querySelector('.shot-block-label');
    if (label) label.textContent = 'Notes & Feedback (' + shotComments.length + ')';
  }
}

function renderEndCard() {
  const lockedImg = state.shots.filter(s => s.winner_image_key).length;
  const lockedVid = state.shots.filter(s => s.winner_video_key).length;
  const total = state.shots.length;
  return \`
  <div class="end-card">
    <div class="end-eyebrow">Fin</div>
    <div class="end-title">Be the someone.</div>
    <div class="end-sub">Lunch Angels — DEF Gala 2026</div>
    <div class="end-prose">
      A 3-minute film. 22 shots. One question:<br><em>Will we keep the cycle going?</em>
    </div>
    <div class="end-stat">\${lockedImg} of \${total} stills locked · \${lockedVid} of \${total} videos locked</div>
  </div>\`;
}

// =========================
// VIDEO HANDLERS
// =========================
function pickVideoFile(callback) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/mp4,video/quicktime,video/webm,video/*';
  input.onchange = () => { if (input.files[0]) callback(input.files[0]); };
  input.click();
}

async function uploadFile(file) {
  const r = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: file
  });
  const d = await r.json();
  return d.key;
}

function getVideoFiles(dt) {
  const files = [];
  if (!dt) return files;
  if (dt.items) {
    for (const item of dt.items) {
      if (item.kind === 'file') {
        const f = item.getAsFile();
        if (f && f.type.startsWith('video/')) files.push(f);
      }
    }
  } else if (dt.files) {
    for (const f of dt.files) {
      if (f.type.startsWith('video/')) files.push(f);
    }
  }
  return files;
}

function dragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
}
function dragEnter(e, el) {
  if (!e.dataTransfer || !e.dataTransfer.types.includes('Files')) return;
  e.preventDefault(); e.stopPropagation();
  el.classList.add('drag-over');
}
function dragLeave(e, el) {
  e.preventDefault(); e.stopPropagation();
  if (!el.contains(e.relatedTarget)) el.classList.remove('drag-over');
}

async function uploadVideoCandidate(shotId, slotIndex) {
  pickVideoFile(async (file) => {
    const key = await uploadFile(file);
    const s = state.shots.find(x => x.id === shotId);
    let videos = s.video_candidate_keys ? JSON.parse(s.video_candidate_keys) : ['','',''];
    while (videos.length < 3) videos.push('');
    videos[slotIndex] = key;
    s.video_candidate_keys = JSON.stringify(videos);
    await fetch('/api/shot/' + shotId, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ video_candidate_keys: s.video_candidate_keys })
    });
    render();
  });
}

async function dropOnVideoCandidate(e, el, shotId, slotIndex) {
  e.preventDefault();
  e.stopPropagation();
  el.classList.remove('drag-over');
  const files = getVideoFiles(e.dataTransfer);
  if (!files.length) return;

  const s = state.shots.find(x => x.id === shotId);
  let videos = s.video_candidate_keys ? JSON.parse(s.video_candidate_keys) : ['','',''];
  while (videos.length < 3) videos.push('');

  let target = slotIndex;
  for (let i = 0; i < files.length && target < 3; i++) {
    const key = await uploadFile(files[i]);
    videos[target] = key;
    target++;
    while (target < 3 && videos[target] && i + 1 < files.length) target++;
  }
  s.video_candidate_keys = JSON.stringify(videos);
  await fetch('/api/shot/' + shotId, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ video_candidate_keys: s.video_candidate_keys })
  });
  render();
}

async function removeVideoCandidate(shotId, slotIndex) {
  const s = state.shots.find(x => x.id === shotId);
  let videos = s.video_candidate_keys ? JSON.parse(s.video_candidate_keys) : ['','',''];
  videos[slotIndex] = '';
  // If this was the winner, clear winner too
  const removedKey = videos[slotIndex];
  s.video_candidate_keys = JSON.stringify(videos);
  const body = { video_candidate_keys: s.video_candidate_keys };
  if (s.winner_video_key === removedKey) {
    s.winner_video_key = null;
    body.winner_video_key = null;
  }
  await fetch('/api/shot/' + shotId, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  render();
}

async function markVideoWinner(shotId, key) {
  const s = state.shots.find(x => x.id === shotId);
  s.winner_video_key = key;
  await fetch('/api/shot/' + shotId, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ winner_video_key: key })
  });
  render();
}

// Lightbox
function openLightbox(key) {
  const lb = document.getElementById('lightbox');
  const oldVid = lb.querySelector('video'); if (oldVid) { oldVid.pause(); oldVid.remove(); }
  let img = lb.querySelector('img');
  if (!img) { img = document.createElement('img'); lb.appendChild(img); }
  img.style.display = '';
  img.src = '/img/' + key;
  lb.classList.add('show');
}
function openLightboxVideo(key) {
  const lb = document.getElementById('lightbox');
  const oldImg = lb.querySelector('img'); if (oldImg) oldImg.remove();
  const oldVid = lb.querySelector('video'); if (oldVid) { oldVid.pause(); oldVid.remove(); }
  const v = document.createElement('video');
  v.src = '/img/' + key; v.controls = true; v.autoplay = true;
  lb.appendChild(v);
  lb.classList.add('show');
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('show');
  const v = lb.querySelector('video'); if (v) { v.pause(); v.remove(); }
  const img = lb.querySelector('img'); if (img) img.src = '';
}

// Keyboard nav
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

loadState();
</script>
</body>
</html>`;