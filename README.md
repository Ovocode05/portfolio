# [facebook] — Krrish Punj's Retro 2004–2006 Profile & Tech Journal

> An authentic, pixel-accurate resurrection of the classic mid-2000s **The Facebook** website design, engineered as a portfolio and technical blog platform for **Krrish Punj** (B.E. Computer Sciences @ Thapar Institute of Engineering and Technology).

![Facebook Retro Portfolio Preview](assets/profile.jpg)

---

## 🏛️ Design Philosophy: The Early Zuckerberg Aesthetic

Reconstructed to look and feel as though **Mark Zuckerberg and Dustin Moskovitz** had custom-coded Krrish's profile for the Harvard / Ivy League / College rollout in 2004–2006:

* **Authentic Color Palette**:
  - Facebook Classic Navy Header: `#3B5998`
  - Subheader Slate Blue: `#6D84B4`
  - Section Header Light Blue: `#D8DFEA`
  - Box Accent Fill: `#ECEFF5` / `#F7F7F7`
  - Grid & Border Gray-Blue: `#B7C4D7`
* **Early Typography**: Compact 11px system font stack (`"Lucida Grande", Tahoma, Verdana, Arial, sans-serif`) with 9px bracketed edit links (`[ edit ]`).
* **The Al Pacino Header Graphic**: The iconic dithered binary face on the top left that adorned Facebook from 2004 to 2006.
* **Cluttered, Dense Information Architecture**: Sidebars, status updates, photo albums, network friends grid, mutual friends, groups, and the legendary interactive **Wall**.
* **Vintage 2006 Sponsored Advertisements**:
  - The exact Panasonic Lumix DMC-FX7 graduation offer from Neville Medhora's 2006 screenshot.
  - Vintage NVIDIA CUDA Beta & Newegg 128 Gigaflops dorm computing banner.
  - Retro Mountain Dew Code Red all-nighter fuel ad.

---

## ⚡ Grounded in Krrish Punj's Technical Portfolio

Every block, entry, and paper is directly synthesized from Krrish's resume and research work:

| Domain | Credential / Research |
| :--- | :--- |
| **Education** | Thapar Institute of Engineering and Technology, Patiala (2023–2027)<br>B.E. Computer Sciences &bull; **CGPA: 8.00 / 10.00**<br>Coursework: Conversational AI, Numerical Linear Algebra, OS, Computer Architecture |
| **CODSAI / Imperial College** | Undergraduate Research Intern (Dec 2025 – May 2026)<br>&bull; CNN computational kernels for 3D FDM fluid simulations on **100M+ point meshes** on **NVIDIA H100 DGX nodes**.<br>&bull; Solver pipelines in **PETSc** for large sparse linear systems via GMRES & CG with **AIR (Algebraic Approximate Ideal Restriction)** and multigrid preconditioning.<br>&bull; Extended PFLARE library test cases and functional verification. |
| **LG Electronics** | Software Development Intern (June 2026 – July 2026)<br>&bull; AI-driven manufacturing analytics, anomaly detection, incident tracking.<br>&bull; Local RAG with `pgvector`, Ollama, and local LLM inference in Docker. |
| **Euler Easel (Project)** | C++, CUDA, OpenMP, AVX-512, Python<br>Hardware-aware adaptive runtime for Sparse Matrix Vector Multiplication (SpMV). Compares CSR, ELLPACK, and Hybrid (CSR-ELL) formats via **one-step reinforcement learning**. |
| **Feels Like Summer (Project)** | Next.js, Go, PostgreSQL, Docker, GORM<br>University research collaboration portal with **15-worker goroutine concurrency**, 5-minute thread-safe TTL cache, and indexed batch PostgreSQL queries. |
| **Publication 1** | *Physics Informed Neural Network Modeling and Uncertainty Quantification of Heat Transfer in Casson Fluid under Local Thermal Non-Equilibrium Effects*, **Indian Journal of Physics**, 2026. (INJP-D-26-00306R2). |
| **Publication 2** | *SAHARA: Articulatory Dynamics-Guided Silent Speech Recognition Using Physics-Informed Neural Networks for Punjabi Vocabulary*, **Computer Methods and Programs in Biomedicine**, 2026. |

---

## 📝 The Tech Blog (Facebook "Notes")

A dedicated space to talk about high-performance computing, fluid mechanics, PINNs, speech AI, and systems engineering:

1. **"Dissecting 100M+ Point FDM Fluid Simulations on H100 DGX Nodes: Where GPU Kernels Choke"**
2. **"Why Generic BLAS Fails for Sparse Matrices: Designing Euler Easel's Adaptive Hybrid SpMV"**
3. **"SAHARA: Engineering Silent Speech Recognition for Punjabi Vocabulary using Physics-Informed Neural Networks"**
4. **"PINN Modeling & Uncertainty Quantification of Heat Transfer in Casson Fluid under Local Thermal Non-Equilibrium"**
5. **"Surviving 15 Worker Goroutines: Scaling 'Feels Like Summer' Go Backend Without Database Choke"**

### Interactive Blog Capabilities:
- **`+ Write a New Note`**: Pop-up composer to write new technical blog posts with title, category, read time, and markdown preview.
- **LocalStorage Persistence**: New notes and reader comments persist across browser refreshes.
- **Category Filter Chips**: Filter between CUDA & HPC, PINNs & Fluids, Speech AI, Go & Backend, and Student Life.

---

## 💻 Interactive Nerdmaxxing Features

- **Poke Krrish**: Interactive poke button with synthesized Web Audio API 2006 retro sine-wave boop, poke counter, and yellow alert banner.
- **The Wall**: Post comments directly to Krrish's wall in real-time, delete posts, and view wall-to-wall dialogs.
- **H100 Bash Terminal (`[bash]`)**:
  - Live command emulator on `krrish@tiet-hpc`.
  - Commands: `help`, `cat resume.txt`, `euler --benchmark`, `pinn --run`, `sahara --infer`, `neofetch`, `skills`, `publications`, `contact`, `clear`.
- **Photo Lightbox**: High-res album view for Euler Easel SpMV benchmarks, Casson fluid simulation heatmaps, the H100 cluster lab, and TIET campus.
- **Audio Synthesizer**: Retro clicks and poke beeps with one-click Mute / Sound toggle.

---

## 🚀 How to Run Locally

You can open `index.html` directly in any web browser, or run a local HTTP server:

```bash
# Option 1: Python 3
cd /home/fakeheadset/.gemini/antigravity/scratch/retro-facebook-portfolio
python3 -m http.server 8080

# Option 2: Node.js / npx
npx serve .
```

Then visit `http://localhost:8080` in your browser.

---

## 🌐 NGINX Deployment on a Free Linux Server

This portfolio is designed to be served as a static frontend plus a small Node.js API. The simplest production setup is:

- NGINX serves the front-end at the public domain root
- `/api/*` is proxied to the Express backend on port `3001`
- Static assets and CSS are cached by NGINX

### 1) Install server dependencies

```bash
sudo apt update
sudo apt install -y nginx nodejs npm
cd /var/www
sudo mkdir -p retro-facebook-portfolio
sudo chown -R $USER:$USER retro-facebook-portfolio
```

### 2) Copy the project to the server

```bash
scp -r ./* user@your-server:/var/www/retro-facebook-portfolio/
scp -r ./backend user@your-server:/var/www/retro-facebook-portfolio/
```

### 3) Install backend dependencies

```bash
cd /var/www/retro-facebook-portfolio/backend
npm install
```

### 4) Start the backend

```bash
cd /var/www/retro-facebook-portfolio/backend
nohup node server.js > /var/log/retro-portfolio-backend.log 2>&1 &
```

### 5) Configure NGINX

Create a site file like this:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/retro-facebook-portfolio;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

Save it to `/etc/nginx/sites-available/retro-facebook-portfolio` and enable it:

```bash
sudo ln -s /etc/nginx/sites-available/retro-facebook-portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6) Optional TLS with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 🧠 Better Software Engineering Profile Signals

This portfolio now emphasizes the engineering identity behind the portfolio itself:

- JavaScript / TypeScript
- Node.js / Express
- REST API design
- NGINX + Linux deployment
- PostgreSQL + Redis-friendly architecture
- Docker / container workflows
- C++ / CUDA / OpenMP for HPC systems
- Python + data tooling
- Performance engineering and systems thinking

These are included in the profile copy to make the site feel like a serious software engineering portfolio rather than a static visual mock-up.

---

## 🗺️ Next Steps: Backend & Protection Roadmap

When you are ready to expand from the frontend design into a live production backend:
1. **Backend API**: Keep the Express API and add real authentication for the owner/admin route.
2. **Database**: Use PostgreSQL with Prisma or SQLAlchemy for persistent posts, dispatch inboxes, and audit logs.
3. **Security & Protection**:
   - Rate limiting via Redis / token bucket
   - Anti-spam captcha or owner-only protected forms
   - Input sanitization and validation before storing user data
   - HTTPS + secure cookie/session handling in production
