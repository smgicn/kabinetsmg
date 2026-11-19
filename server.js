const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Batasi ukuran request body untuk mencegah DoS
app.use(express.json({ limit: '1mb' }));

// 🔥 Disable cache dan tambahkan header keamanan dasar
app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
    });
    next();
});

const DATA_FILE = path.join(__dirname, 'data.json');

// ================= DATA =================
let data = {
    contents: []
};

// Load file secara aman
if (fs.existsSync(DATA_FILE)) {
    try {
        data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        if (!Array.isArray(data.contents)) data.contents = [];
    } catch (err) {
        console.error('Error membaca data.json, inisialisasi ulang:', err);
        data = { contents: [] };
    }
} else {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function save() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error menyimpan ke data.json:', err);
    }
}

// ================= API =================
app.get('/api/data', (req, res) => {
    res.json(data);
});

app.post('/api/contents', (req, res) => {
    const { title, subject, content } = req.body || {};

    // Validasi input
    if (typeof title !== 'string' || typeof subject !== 'string') {
        return res.status(400).json({ error: 'Field title dan subject wajib berupa string' });
    }

    const item = {
        id: Date.now().toString(),
        title: title.slice(0, 500),
        subject: subject.slice(0, 10000),
        content: typeof content === 'string' ? content.slice(0, 100000) : '',
        date: new Date().toISOString()
    };

    data.contents.unshift(item);
    save();

    res.status(201).json(item);
});

app.delete('/api/contents/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = data.contents.length;
    data.contents = data.contents.filter(x => x.id !== id);

    if (data.contents.length === initialLength) {
        return res.status(404).json({ error: 'Konten tidak ditemukan' });
    }

    save();
    res.json({ success: true });
});

// ================= FRONTEND =================
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <title>KB App</title>
</head>
<body>

<h2>Tambah Konten</h2>
<input id="title" placeholder="Judul" maxlength="500"><br><br>
<input id="subject" placeholder="Subject" maxlength="10000"><br><br>
<textarea id="content" placeholder="Isi"></textarea><br><br>
<button onclick="add()">Tambah</button>

<h2>Data</h2>
<div id="list"></div>

<script>
const API = location.origin + '/api';

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

async function load() {
    try {
        const res = await fetch(API + '/data');
        const d = await res.json();

        const el = document.getElementById('list');
        el.innerHTML = '';

        (d.contents || []).forEach(item => {
            const card = document.createElement('div');
            card.style.border = '1px solid #000';
            card.style.margin = '10px';
            card.style.padding = '10px';
            card.innerHTML = \`
                <h3>\${escapeHtml(item.title)}</h3>
                <p>\${escapeHtml(item.subject)}</p>
                <button data-id="\${encodeURIComponent(item.id)}">Hapus</button>
            \`;
            card.querySelector('button').onclick = () => hapus(item.id);
            el.appendChild(card);
        });
    } catch (e) {
        console.error('Gagal memuat data:', e);
    }
}

async function add() {
    const title = document.getElementById('title').value;
    const subject = document.getElementById('subject').value;
    const content = document.getElementById('content').value;

    if (!title || !subject) {
        alert('Judul dan Subject harus diisi');
        return;
    }

    await fetch(API + '/contents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subject, content })
    });

    document.getElementById('title').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('content').value = '';
    load();
}

async function hapus(id) {
    await fetch(API + '/contents/' + encodeURIComponent(id), {
        method: 'DELETE'
    });
    load();
}

// Auto sync setiap 5 detik
setInterval(load, 5000);
load();
</script>

</body>
</html>
    `);
});

// ================= RUN =================
app.listen(PORT, '0.0.0.0', () => {
    console.log('Server jalan di http://localhost:' + PORT);
});
