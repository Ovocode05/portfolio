import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Setup ──────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const DATA_DIR  = join(__dirname, 'data');
const ROOT_DIR = join(__dirname, '..');
const POSTS_FILE = join(DATA_DIR, 'posts.json');
const PING_FILE = join(DATA_DIR, 'pings.json');
const DISPATCHES_FILE = join(DATA_DIR, 'dispatches.json');
const SOFTBOARD_FILE = join(DATA_DIR, 'softboard.json');
const PORT = Number(process.env.PORT) || 3001;

// Ensure data directory exists
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

// Seed file if missing
if (!existsSync(POSTS_FILE)) writeFileSync(POSTS_FILE, '[]', 'utf-8');
if (!existsSync(PING_FILE)) writeFileSync(PING_FILE, JSON.stringify({ count: 0 }, null, 2), 'utf-8');
if (!existsSync(DISPATCHES_FILE)) writeFileSync(DISPATCHES_FILE, '[]', 'utf-8');
if (!existsSync(SOFTBOARD_FILE)) writeFileSync(SOFTBOARD_FILE, '[]', 'utf-8');

// ── Helpers ────────────────────────────────────────────────
function readPosts() {
  try {
    const raw = JSON.parse(readFileSync(POSTS_FILE, 'utf-8'));
    return Array.isArray(raw) ? raw : [];
  } catch {
    try {
      writeFileSync(POSTS_FILE, '[]', 'utf-8');
    } catch {
      // ignore write failures here; the app will continue with an empty array
    }
    return [];
  }
}

function writePosts(posts) {
  const safePosts = Array.isArray(posts) ? posts : [];
  writeFileSync(POSTS_FILE, JSON.stringify(safePosts, null, 2), 'utf-8');
}

function readPingCount() {
  try {
    const raw = JSON.parse(readFileSync(PING_FILE, 'utf-8'));
    const count = Number(raw?.count ?? 0);
    return Number.isFinite(count) ? count : 0;
  } catch {
    writeFileSync(PING_FILE, JSON.stringify({ count: 0 }, null, 2), 'utf-8');
    return 0;
  }
}

function writePingCount(count) {
  const safeCount = Number.isFinite(Number(count)) ? Number(count) : 0;
  writeFileSync(PING_FILE, JSON.stringify({ count: safeCount }, null, 2), 'utf-8');
  return safeCount;
}

function readDispatches() {
  try {
    const raw = JSON.parse(readFileSync(DISPATCHES_FILE, 'utf-8'));
    return Array.isArray(raw) ? raw : [];
  } catch {
    writeFileSync(DISPATCHES_FILE, '[]', 'utf-8');
    return [];
  }
}

function capDispatchStack(dispatches) {
  const safeDispatches = Array.isArray(dispatches) ? dispatches : [];
  const queue = safeDispatches
    .map(normalizeDispatch)
    .filter(Boolean)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return Number(b.id) - Number(a.id);
    })
    .slice(0, 6);

  writeDispatches(queue);
  return queue;
}

function writeDispatches(dispatches) {
  const safeDispatches = Array.isArray(dispatches) ? dispatches : [];
  const capped = safeDispatches
    .map(normalizeDispatch)
    .filter(Boolean)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return Number(b.id) - Number(a.id);
    })
    .slice(0, 6);

  writeFileSync(DISPATCHES_FILE, JSON.stringify(capped, null, 2), 'utf-8');
  return capped;
}

function normalizeDispatch(dispatch) {
  if (!dispatch || typeof dispatch !== 'object') return null;

  const normalized = {
    id: String(dispatch.id || 'dispatch-' + Date.now()),
    author: String(dispatch.author || 'Peer Researcher').trim() || 'Peer Researcher',
    role: String(dispatch.role || 'Collaborator').trim() || 'Collaborator',
    tag: String(dispatch.tag || 'Research Query').trim() || 'Research Query',
    time: String(dispatch.time || new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })).trim(),
    avatar: String(dispatch.avatar || 'assets/profile.jpg').trim() || 'assets/profile.jpg',
    content: String(dispatch.content || '').trim(),
    unread: dispatch.unread !== false,
    pinned: Boolean(dispatch.pinned),
    senderType: dispatch.senderType === 'me' ? 'me' : 'writer'
  };

  if (!normalized.content) return null;
  return normalized;
}

function readSoftboardNotes() {
  try {
    const raw = JSON.parse(readFileSync(SOFTBOARD_FILE, 'utf-8'));
    return Array.isArray(raw) ? raw : [];
  } catch {
    writeFileSync(SOFTBOARD_FILE, '[]', 'utf-8');
    return [];
  }
}

function writeSoftboardNotes(notes) {
  const safeNotes = Array.isArray(notes) ? notes : [];
  writeFileSync(SOFTBOARD_FILE, JSON.stringify(safeNotes, null, 2), 'utf-8');
}

function isAdminRequest(req) {
  return String(req.headers['x-admin-secret'] || '').trim() === 'krrish-owner';
}

function normalizePost(post) {
  if (!post || typeof post !== 'object') return null;

  return {
    id: String(post.id || 'post-' + Date.now()),
    title: String(post.title || 'Untitled post').trim(),
    date: post.date || new Date().toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    }),
    category: post.category || 'Personal',
    readTime: post.readTime || '5 min read',
    snippet: post.snippet || (String(post.content || '').substring(0, 190) + (String(post.content || '').length > 190 ? '...' : '')),
    content: String(post.content || '').trim(),
    comments: Array.isArray(post.comments) ? post.comments : []
  };
}

// ── Express App ────────────────────────────────────────────
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.static(ROOT_DIR));

app.get('/', (_req, res) => {
  res.sendFile(join(ROOT_DIR, 'index.html'));
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, postsFile: POSTS_FILE, pingFile: PING_FILE });
});

app.get('/api/pings', (_req, res) => {
  res.json({ count: readPingCount() });
});

app.post('/api/pings/increment', (_req, res) => {
  const count = readPingCount() + 1;
  res.json({ count: writePingCount(count) });
});

app.put('/api/pings', (req, res) => {
  const count = Number(req.body?.count ?? 0);
  res.json({ count: writePingCount(count) });
});

app.get('/api/dispatches', (_req, res) => {
  const dispatches = capDispatchStack(readDispatches());
  res.json(dispatches);
});

app.post('/api/dispatches', (req, res) => {
  const payload = normalizeDispatch({
    id: req.body?.id || 'dispatch-' + Date.now(),
    author: req.body?.author,
    role: req.body?.role,
    tag: req.body?.tag,
    time: req.body?.time || new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    avatar: req.body?.avatar || 'assets/profile.jpg',
    content: req.body?.content,
    unread: req.body?.unread !== false,
    pinned: Boolean(req.body?.pinned),
    senderType: req.body?.senderType === 'me' ? 'me' : 'writer'
  });

  if (!payload) {
    return res.status(400).json({ error: 'content is required' });
  }

  const dispatches = readDispatches();
  dispatches.unshift(payload);
  const limited = writeDispatches(dispatches);
  res.status(201).json(limited[0] || payload);
});

app.patch('/api/dispatches/:id/pin', (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const dispatches = readDispatches().map(normalizeDispatch).filter(Boolean);
  const index = dispatches.findIndex(item => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Dispatch not found' });
  }

  dispatches[index].pinned = !dispatches[index].pinned;
  writeDispatches(dispatches);
  res.json(dispatches[index]);
});

app.delete('/api/dispatches/:id', (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const dispatches = readDispatches().map(normalizeDispatch).filter(Boolean);
  const next = dispatches.filter(item => item.id !== req.params.id);

  if (next.length === dispatches.length) {
    return res.status(404).json({ error: 'Dispatch not found' });
  }

  writeDispatches(next);
  res.json({ ok: true });
});

app.get('/api/softboard', (_req, res) => {
  const notes = readSoftboardNotes();
  res.json(notes);
});

app.post('/api/softboard', (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const text = String(req.body?.text || '').trim();
  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  const notes = readSoftboardNotes();
  const item = {
    id: String(req.body?.id || 'note-' + Date.now()),
    text,
    pinned: Boolean(req.body?.pinned),
    createdAt: req.body?.createdAt || new Date().toISOString()
  };

  notes.unshift(item);
  writeSoftboardNotes(notes);
  res.status(201).json(item);
});

app.patch('/api/softboard/:id/pin', (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const notes = readSoftboardNotes();
  const index = notes.findIndex(item => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  notes[index].pinned = !notes[index].pinned;
  writeSoftboardNotes(notes);
  res.json(notes[index]);
});

app.delete('/api/softboard/:id', (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const notes = readSoftboardNotes();
  const next = notes.filter(item => item.id !== req.params.id);

  if (next.length === notes.length) {
    return res.status(404).json({ error: 'Note not found' });
  }

  writeSoftboardNotes(next);
  res.json({ ok: true });
});

// GET /api/posts  — return all posts (newest first)
app.get('/api/posts', (_req, res) => {
  const posts = readPosts().map(normalizePost).filter(Boolean);
  res.json(posts);
});

// GET /api/posts/:id — return a single post
app.get('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// POST /api/posts — create a new post
app.post('/api/posts', (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const title = String(req.body?.title || '').trim();
  const readTime = String(req.body?.readTime || '5 min read').trim();
  const content = String(req.body?.content || '').trim();

  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }

  const posts = readPosts();

  const newPost = normalizePost({
    id: 'post-' + Date.now(),
    title,
    date: new Date().toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    }),
    category: 'Personal',
    readTime: readTime || '5 min read',
    content,
    comments: []
  });

  posts.unshift(newPost);
  writePosts(posts);

  res.status(201).json(newPost);
});

// PUT /api/posts/:id — update an existing post
app.put('/api/posts/:id', (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const title = String(req.body?.title || '').trim();
  const readTime = String(req.body?.readTime || '').trim();
  const content = String(req.body?.content || '').trim();

  let posts = readPosts().map(normalizePost).filter(Boolean);
  const index = posts.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }

  const updated = normalizePost({
    ...posts[index],
    title,
    readTime: readTime || posts[index].readTime || '5 min read',
    content,
    snippet: content.substring(0, 190) + (content.length > 190 ? '...' : '')
  });

  posts[index] = updated;
  writePosts(posts);

  res.json(updated);
});

// DELETE /api/posts/:id — delete a post
app.delete('/api/posts/:id', (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  let posts = readPosts().map(normalizePost).filter(Boolean);
  const before = posts.length;
  posts = posts.filter(p => p.id !== req.params.id);
  if (posts.length === before) {
    return res.status(404).json({ error: 'Post not found' });
  }
  writePosts(posts);
  res.json({ ok: true });
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  [Krrish.] Site live on http://0.0.0.0:${PORT}\n`);
  console.log(`  Public API: http://0.0.0.0:${PORT}/api/posts\n`);
});
