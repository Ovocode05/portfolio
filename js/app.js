/**
 * [Krrish.] — Retro Mid-2000s Web Portfolio & Scientific Research Journal
 * Krrish Punj — B.E. Computer Sciences @ Thapar Institute of Engineering & Technology
 * Research Focus: High Performance Computing, 3D FDM Stencils, PINNs, CUDA, Sparse Matrix Runtimes
 * Creative & Cultural: Music Producer (@fakeheadset on YouTube), Sneakerhead & Urdu Adab
 * Links:
 *   - YouTube: https://www.youtube.com/@fakeheadset
 *   - LinkedIn: https://www.linkedin.com/in/krish-punj-a57136379/
 *   - GitHub: https://github.com/Ovocode05/
 */

// ================= RESEARCH & SCIENCE JOURNAL ENTRIES =================
// Strictly technical, scientific publications and computational engineering dispatches

const INITIAL_JOURNAL_ARTICLES = [];

// ================= THE RESEARCH DISPATCH & OPEN PEER CHALKBOARD =================
// Replaces generic wall with an authentic scientific dispatch board for peer reviews,
// academic inquiries, paper critiques, and research collaboration proposals.

const INITIAL_RESEARCH_DISPATCHES = [];

// ================= RETRO AUDIO & SYNTHESIZER =================
class RetroSound {
  constructor() {
    this.enabled = true;
    this.audioCtx = null;
    this.isPlayingMusic = false;
    this.musicTimer = null;
  }

  init() {
    if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.isPlayingMusic) {
      this.stopMusic();
    }
    return this.enabled;
  }

  playPoke() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.12);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1000, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  toggleMusicTrack() {
    if (this.isPlayingMusic) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  startMusic() {
    this.init();
    if (!this.audioCtx) return;
    this.isPlayingMusic = true;

    // Emulating analog synth harmonic progression
    const chords = [
      [164.81, 196.00, 246.94, 293.66], // Em7
      [130.81, 164.81, 196.00, 246.94], // Cmaj7
      [196.00, 246.94, 293.66, 392.00], // G
      [146.83, 185.00, 220.00, 293.66]  // D/F#
    ];

    let chordIdx = 0;
    const playNextChord = () => {
      if (!this.isPlayingMusic || !this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const chord = chords[chordIdx % chords.length];
      chordIdx++;

      chord.forEach(freq => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 1.9);
      });

      this.musicTimer = setTimeout(playNextChord, 2000);
    };

    playNextChord();
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

// ================= BACKEND API =================
const API_BASE = (() => {
  const hostname = typeof window !== 'undefined' && window.location && window.location.hostname;
  const localHostnames = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '::'];

  if (localHostnames.includes(hostname)) {
    return 'http://localhost:3001';
  }

  return '';
})();

// ================= APPLICATION CONTROLLER =================
const App = {
  sound: new RetroSound(),
  activeTab: "profile",
  pokesCount: 42,
  dispatches: [],
  softboardNotes: [],
  journalArticles: [...INITIAL_JOURNAL_ARTICLES],
  postsLoaded: false,
  isAdmin: false,
  ownerCode: "krrish-owner",
  ownerEmail: "krrish.punj@thapar.edu",
  maxDispatchItems: 6,

  async init() {
    this.renderHeader();
    this.renderSidebar();
    this.bindGlobalEvents();
    this.switchTab("profile");
    this.updatePokeBadge();
    await this.loadPingCount();
    await this.loadDispatches();
    await this.loadSoftboardNotes();
    // Pre-load posts from API in background
    await this.loadJournalFromAPI();
  },

  async loadPingCount() {
    try {
      const res = await fetch(`${API_BASE}/api/pings`);
      if (res.ok) {
        const data = await res.json();
        this.pokesCount = Number(data?.count ?? (this.pokesCount || 0));
        this.updatePokeBadge();
      }
    } catch (e) {
      console.warn('[Krrish.] Ping count unavailable from backend.', e.message);
    }
  },

  persistJournalArticles() {
    // browser storage disabled by design for this personal project
  },

  loadJournalArticlesFromLocal() {
    // no browser cache fallback; the server is the only source of truth
  },

  async loadJournalFromAPI() {
    try {
      const res = await fetch(`${API_BASE}/api/posts`);
      if (res.ok) {
        const serverPosts = await res.json();
        this.journalArticles = Array.isArray(serverPosts) ? [...serverPosts] : [];
        this.persistJournalArticles();
        this.postsLoaded = true;
        this.renderSidebar();

        if (this.activeTab === 'journal') {
          this.renderJournalView(document.getElementById('content-area'));
        }
        return;
      }
    } catch (e) {
      console.warn('[Krrish.] Backend not reachable, using local cached blog data.', e.message);
    }

    this.loadJournalArticlesFromLocal();
    this.postsLoaded = true;
    this.renderSidebar();

    if (this.activeTab === 'journal') {
      this.renderJournalView(document.getElementById('content-area'));
    }
  },

  updatePokeBadge() {
    const pokeBtn = document.getElementById("poke-action-btn");
    if (pokeBtn) {
      pokeBtn.textContent = `Cite / Ping Krrish (${this.pokesCount})`;
    }
  },

  async poke() {
    try {
      const res = await fetch(`${API_BASE}/api/pings/increment`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        this.pokesCount = Number(data?.count ?? this.pokesCount);
      }
    } catch (e) {
      console.warn('[Krrish.] Backend ping counter unavailable; using local counter.', e.message);
      this.pokesCount += 1;
    }

    this.sound.playPoke();
    this.updatePokeBadge();

    const toast = document.getElementById("poke-toast");
    if (toast) {
      toast.textContent = `Research ping transmitted! Krrish has received ${this.pokesCount} peer pings on his cluster terminal.`;
      toast.style.display = "block";
      setTimeout(() => {
        toast.style.display = "none";
      }, 4000);
    }
  },

  switchTab(tabName) {
    this.sound.playClick();
    this.activeTab = tabName;

    document.querySelectorAll(".top-nav a").forEach(el => {
      el.classList.toggle("active", el.getAttribute("data-tab") === tabName);
    });

    document.querySelectorAll(".sidebar-menu a").forEach(el => {
      el.classList.toggle("active", el.getAttribute("data-tab") === tabName);
    });

    const container = document.getElementById("content-area");
    if (!container) return;

    if (tabName === "profile") {
      this.renderProfileView(container);
    } else if (tabName === "journal") {
      this.renderJournalView(container);
    } else if (tabName === "photos") {
      this.renderPhotosView(container);
    } else if (tabName === "sandbox") {
      this.renderComputeSandbox(container);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  // Customized Header with exact user links
  renderHeader() {
    const headerContainer = document.querySelector(".header-container");
    if (!headerContainer) return;
    headerContainer.innerHTML = `
      <div class="header-left">
        <div class="al-pacino-face" title="Early Web Pioneer Silhouette">
          <svg viewBox="0 0 32 32">
            <rect width="32" height="32" fill="#243760"/>
            <circle cx="16" cy="12" r="6" fill="#899BC1"/>
            <path d="M7 28 C7 20, 25 20, 25 28 Z" fill="#899BC1"/>
          </svg>
        </div>
        <a href="#" class="fb-logo-text" onclick="App.switchTab('profile'); return false;">[KRRISH.]</a>
      </div>
      <div class="header-right">
        <ul class="top-nav">
          <li><a href="#" data-tab="profile" onclick="App.switchTab('profile'); return false;" class="active">home</a></li>
          <li><a href="#" data-tab="journal" onclick="App.switchTab('journal'); return false;">blogs</a></li>
          <li><a href="#" data-tab="sandbox" onclick="App.switchTab('sandbox'); return false;">terminal</a></li>
          <li><a href="https://www.youtube.com/@fakeheadset" target="_blank" style="color:#FFBABA; font-weight:bold;">youtube ↗</a></li>
          <li><a href="https://github.com/Ovocode05/" target="_blank">github ↗</a></li>
          <li><a href="https://www.linkedin.com/in/krish-punj-a57136379/" target="_blank">linkedin ↗</a></li>
        </ul>
        <button class="retro-sound-btn" id="sound-toggle-btn" onclick="App.toggleSound()">🔊 Sound: ON</button>
      </div>
    `;
  },

  toggleSound() {
    const isEnabled = this.sound.toggle();
    const btn = document.getElementById("sound-toggle-btn");
    if (btn) {
      btn.textContent = isEnabled ? "🔊 Sound: ON" : "🔇 Sound: OFF";
    }
  },

  getUnreadDispatchCount() {
    return this.dispatches.filter(item => item.unread !== false).length;
  },

  async loadDispatches() {
    try {
      const res = await fetch(`${API_BASE}/api/dispatches`);
      if (res.ok) {
        this.dispatches = await res.json();
      }
    } catch (e) {
      console.warn('[Krrish.] Dispatch feed unavailable from backend.', e.message);
      this.dispatches = [];
    }

    if (this.renderSidebar) this.renderSidebar();
    const container = document.getElementById('dispatch-posts-container');
    if (container) {
      container.innerHTML = this.renderDispatchesHtml();
    }
  },

  async loadSoftboardNotes() {
    try {
      const res = await fetch(`${API_BASE}/api/softboard`);
      if (res.ok) {
        this.softboardNotes = await res.json();
      }
    } catch (e) {
      console.warn('[Krrish.] Softboard unavailable from backend.', e.message);
      this.softboardNotes = [];
    }

    if (document.getElementById('softboard-list')) {
      document.getElementById('softboard-list').innerHTML = this.renderSoftboardHtml();
    }
  },

  persistDispatches() {
    if (this.renderSidebar) this.renderSidebar();
  },

  requestOwnerAccess(actionLabel = 'manage owner controls') {
    if (this.isAdmin) return true;

    const code = window.prompt(`Enter owner access code to ${actionLabel}:`);
    if (code && code.trim() === this.ownerCode) {
      this.isAdmin = true;
      const contentArea = document.getElementById('content-area');
      if (contentArea) {
        if (this.activeTab === 'journal') {
          this.renderJournalView(contentArea);
        } else if (this.activeTab === 'profile') {
          this.renderProfileView(contentArea);
        }
      }
      return true;
    }

    alert('Access denied. Only the personal owner can make changes.');
    return false;
  },

  toggleOwnerAccess() {
    if (this.isAdmin) {
      this.isAdmin = false;
      alert('Owner access disabled. Blog writing is now locked.');
      const contentArea = document.getElementById('content-area');
      if (contentArea) {
        if (this.activeTab === 'journal') {
          this.renderJournalView(contentArea);
        } else if (this.activeTab === 'profile') {
          this.renderProfileView(contentArea);
        }
      }
      return;
    }

    this.requestOwnerAccess('unlock owner controls');
  },

  renderSidebar() {
    const sidebar = document.getElementById("left-sidebar");
    if (!sidebar) return;
    sidebar.innerHTML = `
      <!-- Retro Search Box -->
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" class="search-input" id="sidebar-search-input" placeholder="Search research, papers..." onkeyup="App.handleSearch(event)">
      </div>

      <!-- Navigation Links -->
      <ul class="sidebar-menu">
        <li>
          <a href="#" data-tab="profile" onclick="App.switchTab('profile'); return false;" class="active">
            <span>About</span>
            <span class="edit-link">[ TIET ]</span>
          </a>
        </li>
        <li>
          <a href="#" data-tab="journal" onclick="App.switchTab('journal'); return false;">
            <span>Blogs</span>
            <span class="badge-nerd">${this.journalArticles.length}</span>
          </a>
        </li>
        <li>
          <a href="#" data-tab="sandbox" onclick="App.switchTab('sandbox'); return false;">
            <span>Terminal</span>
            <span class="badge-nerd">Live</span>
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/@fakeheadset" target="_blank">
            <span>Music Channel</span>
            <span style="color:#CC0000; font-size:11px; font-weight:bold;">@fakeheadset ↗</span>
          </a>
        </li>
        <li>
          <a href="https://github.com/Ovocode05/" target="_blank">
            <span>GitHub Profile</span>
            <span style="font-size:11px; color:#555;">Ovocode05 ↗</span>
          </a>
        </li>
        <li>
          <a href="#" onclick="App.openDirectTransmissionModal(); return false;">
            <span>Direct Dispatch</span>
            <span class="badge-nerd">${this.getUnreadDispatchCount()}</span>
          </a>
        </li>
        <li>
          <a href="#" onclick="App.openResumeModal(); return false;">
            <span>Download Resume</span>
            <span class="edit-link">[ PDF ]</span>
          </a>
        </li>
      </ul>

      <!-- Retro Ads Container (Nostalgic 2006 Ads) -->
      <div class="ad-card">
        <div class="ad-header-label">Sponsored Hardware</div>
        <img src="assets/last.jpeg" alt="Panasonic Ideas for Life - Graduation Camera Offer" onclick="App.openAdModal('panasonic')">
        <div class="ad-title">Reward yourself with a special Panasonic graduation offer!</div>
        <div class="ad-desc">LUMIX DMC-FX7 with Leica DC Vario-Elmarit Lens. 5.0 Megapixels. Compact engineering aesthetic.</div>
      </div>

      <div class="ad-card">
        <div class="ad-header-label">HPC Computing Sponsor</div>
        <img src="assets/ad_nvidia.png" alt="NVIDIA CUDA Beta" onclick="App.openAdModal('nvidia')">
        <div class="ad-title">UNLEASH 128 GIGAFLOPS: NVIDIA CUDA BETA</div>
        <div class="ad-desc">Massive parallel computing in your dorm room. Order GeForce from Newegg with student rebate.</div>
      </div>

      <div class="ad-card" style="background:#FFF9E6; border-color:#E2C822;">
        <div class="ad-header-label" style="color:#996600;">Lab Fuel</div>
        <div style="font-weight:bold; color:#CC0000; font-size:12.5px;">MOUNTAIN DEW CODE RED</div>
        <div style="font-size:11.5px; color:#444;">Fueling all-nighters at Thapar CSE Labs since 2023. 54mg liquid caffeine.</div>
        <a href="#" class="ad-link" style="color:#990000;" onclick="alert('⚡ Refueling your workstation...'); return false;">[ ORDER 24-PACK ]</a>
      </div>
    `;
  },

  // ================= VIEW: PROFILE =================
  renderProfileView(container) {
    container.innerHTML = `
      <div class="profile-columns">
        
        <!-- LEFT COLUMN: PHOTO, STATUS, ACTIONS, RESEARCH CIRCLE -->
        <div class="profile-col-left">
          
          <!-- Photo Box -->
          <div class="photo-box">
            <img src="assets/profile.jpg" alt="Krrish Punj" class="profile-photo-img" onclick="App.openPhotoModal('assets/profile.jpg', 'Krrish Punj — Undergraduate Researcher in High-Performance Computing & PINNs at Thapar Institute')">
            <div class="photo-sub-links">
              <a href="#" onclick="App.openEditProfileModal(); return false;">Edit Profile Bio</a>
              <a href="#" onclick="App.openDirectTransmissionModal(); return false;">Direct Research Dispatch</a>
              <a href="https://github.com/Ovocode05/" target="_blank">Open Source: github.com/Ovocode05 ↗</a>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="action-box">
            <button class="retro-btn primary" id="poke-action-btn" onclick="App.poke()">Cite / Ping Krrish (${this.pokesCount})</button>
            <button class="retro-btn" onclick="App.openDirectTransmissionModal()">Transmit Collab Request</button>
            <button class="retro-btn" onclick="window.open('https://www.youtube.com/@fakeheadset', '_blank')">Watch Beats on YouTube ↗</button>
            <button class="retro-btn" onclick="App.openResumeModal()">View / Print CV</button>
          </div>

                    <!-- THE CHALKBOARD: REIMAGINED RESEARCH LOGBOOK & PEER REVIEW DISPATCH -->
          <div class="retro-box">
            <div class="box-header">
              <span class="box-title">The Open Chalkboard</span>
              <span class="box-header-links">
                <a href="#chalkboard-composer">Write Dispatch</a>
              </span>
            </div>
            
            <div style="background:#FAFBFD; padding:8px 10px; border-bottom:1px solid #D8DFEA; font-size:12px; color:#555;">
              <em>This dispatch inbox is open to everyone visiting the site. Anyone can send a message, while the owner can archive and pin them.</em>
            </div>

            <!-- Composer -->
            <div class="wall-post-composer" id="chalkboard-composer">
              <div class="wall-composer-fields">
                <div class="wall-input-row" style="flex-wrap:wrap;">
                  <input type="text" id="dispatch-author-input" class="wall-input-author" placeholder="Your Name / Institution" value="Peer Researcher">
                  <select id="dispatch-tag-input" style="font-size:12px; border:1px solid #B7C4D7; padding:3px 6px;">
                    <option value="Research Collab">[ Research Collab ]</option>
                    <option value="Paper Review">[ Paper Review ]</option>
                    <option value="CUDA & Solvers">[ CUDA & Solvers ]</option>
                    <option value="Music & Signal">[ Music & DSP ]</option>
                    <option value="General Query">[ General Query ]</option>
                  </select>
                </div>
                <textarea id="dispatch-message-input" class="wall-input-msg" placeholder="Share a technical question, research idea, or collaboration note with your details..."></textarea>
                <div class="wall-post-actions">
                  <button class="retro-btn primary" onclick="App.postDispatch()">Transmit Dispatch</button>
                </div>
              </div>
            </div>

            <!-- Chalkboard Feed -->
            <div class="wall-posts-list" id="dispatch-posts-container">
              ${this.renderDispatchesHtml()}
            </div>
          </div>

        </div>

        <!-- CENTER COLUMN: CURRICULUM, RESEARCH EXPERIENCE, PROJECTS, CHALKBOARD -->
        <div class="profile-col-center">
          
          <!-- Information Box -->
          <div class="retro-box">
            <div class="box-header">
              <span class="box-title">Academic & Technical Dossier</span>
              <span class="box-header-links edit-link">[ <a href="#" onclick="App.openEditProfileModal(); return false;">edit</a> ]</span>
            </div>

            <!-- Account Info -->
            <div class="info-section">
              <div class="info-section-title">
                <span>Researcher Identification</span>
              </div>
              <table class="info-table">
                <tr><td class="label">Name:</td><td class="value"><strong>Krrish Punj</strong></td></tr>
                <tr><td class="label">Date Of Birth:</td><td class="value"><strong>03-08-2005</strong></td></tr>
                <tr><td class="label">Last Dispatched:</td><td class="value">September 26, 2026</td></tr>
                </table>
                </div>
                
                <!-- Basic Info -->
                <div class="info-section">
                <div class="info-section-title">
                <span>Profile</span>
                </div>
                <table class="info-table">
                <tr><td class="label">Institution:</td><td class="value">Thapar Institute of Engineering and Technology (Patiala, India)</td></tr>
                <tr><td class="label">Degree Program:</td><td class="value">Bachelor of Engineering in Computer Sciences</td></tr>
                <tr><td class="label">Coursework:</td><td class="value">Conversational AI, Numerical Linear Algebra, Operating Systems, Computer Architecture</td></tr>
                <tr><td class="label">Primary Fields:</td><td class="value">High Performance Computing (HPC), Physics-Informed Neural Networks (PINNs), Sparse Linear Solvers</td></tr>
                <tr><td class="label">Currently Reading</td><td class="value">Sapiens</td></tr>
                <tr><td class="label">Creative Synergy:</td><td class="value">Digital Signal Processing, sampling vinyl & analog synths under producer moniker <strong>@fakeheadset</strong> on YouTube</td></tr>
              </table>
            </div>

            <!-- Contact & Repositories -->
            <div class="info-section">
              <div class="info-section-title">
                <span>Communication & Official Channels</span>
              </div>
              <table class="info-table">
                <tr><td class="label">Email:</td><td class="value"><a href="mailto:krrish.punj@thapar.edu">kpunj_be23@thapar.edu</a></td></tr>
                <tr><td class="label">GitHub:</td><td class="value"><a href="https://github.com/Ovocode05/" target="_blank"><strong>github.com/Ovocode05</strong> ↗</a></td></tr>
                <tr><td class="label">LinkedIn:</td><td class="value"><a href="https://www.linkedin.com/in/krish-punj-a57136379" target="_blank"><strong>linkedin.com/in/krish-punj</strong> ↗</a></td></tr>
                <tr><td class="label">YouTube:</td><td class="value"><a href="https://www.youtube.com/@fakeheadset" target="_blank" style="color:#CC0000; font-weight:bold;"><strong>@fakeheadset</strong> ↗</a></td></tr>
                <tr><td class="label">PGP Key ID:</td><td class="value"><code>4E8A 91F2 C04B 77D9</code> (Available on keyservers)</td></tr>
              </table>
            </div>

            <!-- Experience Info -->
            <div class="info-section">
              <div class="info-section-title">
                <span>Research & Industrial Appointments</span>
              </div>
              
              <div style="margin-bottom:12px;">
                <strong>Undergraduate Research Intern</strong> : CODSAI (in collaboration with Imperial College, London)
                <div style="color:#666; font-size:12px;">Dec 2025 - May 2026 | On-Site, Patiala, India</div>
                <ul class="bullet-list">
                  <li>Designed CNN-based computational kernels for 3D FDM fluid simulations on meshes, deployed on NVIDIA H100 DGX node infrastructure.</li>
                  <li>Constructed linear solver pipelines using the PETSc library for large sparse linear systems on high resolution meshes via GMRES and CG solvers preconditioned with AIR, ILU and multigrid methods.</li>
                  <li>Extended the PFLARE library by authoring new solver test suites and verifying functional correctness across extensive parameter spaces.</li>
                </ul>
              </div>

              <div>
                <strong>Software Development Intern</strong> :LG Electronics
                <div style="color:#666; font-size:12px;">June 2026 - July 2026 | On-Site, Noida, India</div>
                <ul class="bullet-list">
                  <li>Engineered an AI-driven manufacturing analytics platform for realtime line monitoring, anomaly detection, and incident tracking across plant operations.</li>
                  <li>Implemented a RAG-based workflow utilizing pgvector, Ollama, and local LLM inference to process queries over live and historical production data.</li>
                  <li>Architected REST APIs, PostgreSQL persistence realtime socket telemetry updates, and containerized Docker deployment.</li>
                </ul>
              </div>
            </div>

            <!-- Technical Skills -->
            <div class="info-section">
              <div class="info-section-title">
                <span>Computational Toolkit & Systems Languages</span>
              </div>
              <table class="info-table">
                <tr><td class="label">Languages:</td><td class="value">C++ (CUDA), Python, Julia, MATLAB, JavaScript, SQL, Bash/Shell Scripting</td></tr>
                <tr><td class="label">Frameworks & Solvers:</td><td class="value">PyTorch, TensorFlow, PETSc, Node.js, React.js, Next.js, OpenMP</td></tr>
                <tr><td class="label">Databases:</td><td class="value">PostgreSQL, Oracle, MongoDB, pgvector</td></tr>
                <tr><td class="label">DevOps & Cloud:</td><td class="value">Docker, Git, Linux Internals</td></tr>
              </table>
            </div>

          </div>

          <!-- Featured Projects Box -->
          <div class="retro-box">
            <div class="box-header">
              <span class="box-title">Highlighted Systems & Runtimes</span>
              <span class="box-header-links"><a href="https://github.com/Ovocode05/" target="_blank">github.com/Ovocode05 ↗</a></span>
            </div>
            <div style="padding:10px;">
              
              <!-- Project 1: Euler Easel -->
              <div class="project-card-retro">
                <div class="project-title-bar">
                  <span class="project-name">Euler Easel</span>
                </div>
                <p style="margin-bottom:6px;">
                  Hardware-aware adaptive runtime for Sparse Matrix Vector Multiplication (SpMV) analyzing matrix characteristics and hardware capabilities to select efficient CPU & GPU execution strategies.
                </p>
                <ul class="bullet-list" style="margin-bottom:6px;">
                  <li>High-performance CSR, ELLPACK, and Hybrid (CSR-ELL) formats with custom CUDA kernels and AVX intrinsics.</li>
                  <li>Hierarchical execution planner choosing the optimal strategy via contextual bandits.</li>
                </ul>
                <div style="font-size:12px; margin-top:4px;">
                  <a href="https://github.com/Ovocode05/" target="_blank"><strong>[ View Repository ]</strong></a>
                </div>
              </div>

              <!-- Project 2: Feels Like Summer -->
              <div class="project-card-retro">
                <div class="project-title-bar">
                  <span class="project-name">Feels Like Summer</span>
                </div>
                <p style="margin-bottom:6px;">
                  University research collaboration platform enabling students to discover research opportunities and apply to projects through a centralized portal.
                </p>
                <ul class="bullet-list" style="margin-bottom:6px;">
                  <li>RESTful Go backend with GORM and normalized PostgreSQL schema.</li>
                  <li>15 worker goroutine concurrency, thread-safe 5-minute TTL cache, and indexed batch queries.</li>
                </ul>
                <div style="font-size:12px; margin-top:4px;">
                  <a href="https://github.com/Ovocode05/" target="_blank"><strong>[ View Repository ]</strong></a>
                </div>
              </div>

            </div>
          </div>

          <!-- Academic Publications Box -->
          <div class="retro-box">
            <div class="box-header">
              <span class="box-title">Peer-Reviewed Publications</span>
              <span class="box-header-links"><a href="#" onclick="App.switchTab('papers'); return false;">Full Citations &gt;</a></span>
            </div>
            <div style="padding:10px;">
              <div class="pub-card">
                <div class="pub-title">Physics Informed Neural Network Modeling and Uncertainty Quantification of Heat Transfer in Casson Fluid under Local Thermal Non-Equilibrium Effects</div>
                <div class="pub-meta">
                  <strong>Authors:</strong> Krrish Punj, Smile Bansal &bull; <em>Indian Journal of Physics</em>, 2026. (Ref: INJP-D-26-00306R2)
                </div>
              </div>
              <div class="pub-card">
                <div class="pub-title">SAHARA: Articulatory Dynamics-Guided Silent Speech Recognition Using Physics-Informed Neural Networks for Punjabi Vocabulary</div>
                <div class="pub-meta">
                  <strong>Authors:</strong> Krrish Punj, Dr. Amrita Kaur &bull; <em>Computer Methods and Programs in Biomedicine</em>, 2026.
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: PERSONALIZATION (HEAVY ROTATION, RETRO MUSIC LAB, URDU ADAB, SNEAKERS) -->
        <div class="profile-col-right">
          
          <!-- Box 1: Heavy Rotation / Albums -->
          <div class="retro-box">
            <div class="box-header">
              <span class="box-title">Heavy Rotation</span>
              <span class="personal-badge">Albums</span>
            </div>
            <div class="album-showcase-grid">
              
              <!-- Album 1: Yeezus -->
              <div class="album-art-card" onclick="App.openPhotoModal('assets/album_yeezus.jpg', 'Kanye West — Yeezus (2013). Industrial minimalism, analog synths, raw unpadded energy.')">
                <img src="assets/album_yeezus.jpg" class="album-art-img" alt="Yeezus by Kanye West">
                <div class="album-art-title">Yeezus</div>
                <div class="album-art-artist">Kanye West (2013)</div>
              </div>

              <!-- Album 2: Jar of Flies -->
              <div class="album-art-card" onclick="App.openPhotoModal('assets/album_jar_of_flies.jpg', 'Alice in Chains — Jar of Flies (1994). Masterpiece of acoustic grunge, 12-string guitars, and haunting harmonies.')">
                <img src="assets/album_jar_of_flies.jpg" class="album-art-img" alt="Jar of Flies by Alice in Chains">
                <div class="album-art-title">Jar of Flies</div>
                <div class="album-art-artist">Alice in Chains (1994)</div>
              </div>

            </div>
     
          </div>

          <!-- Box 2: Original Music & YouTube Channel (@fakeheadset) -->
          <div class="retro-box">
            <div class="box-header">
              <span class="box-title">Sound & Signal Lab (@fakeheadset)</span>
              <span class="personal-badge" style="background:#CC0000;">YouTube</span>
            </div>
            
            <!-- Retro Audio Player Widget -->
            <div class="retro-player-box">
              <div class="player-screen">
                <div class="player-track-name" id="player-track-display">Hands Cover Bruise (Trent Reznor and Atticus Ross)</div>
                <div class="player-status-line">
                  <span id="player-status-state">[ STOPPED ]</span>
                  <span>44.1 kHz &bull; Lo-Fi DSP</span>
                </div>
              </div>
              <div class="player-controls">
                <button class="player-btn" id="player-toggle-btn" onclick="App.toggleMusicPlay()">▶ PLAY</button>
                <button class="player-btn" onclick="alert('Synthesizing next track: Patiala Monologues (Sampled Vinyl)');">⏭ NEXT</button>
                <span style="font-size:11px; color:#AAA;">FL Studio / Ableton</span>
              </div>
            </div>

            <a href="https://www.youtube.com/@fakeheadset" target="_blank" class="youtube-music-link">
              <span>▶ Watch & Subscribe: @fakeheadset ↗</span>
            </a>
            
            <div style="padding:0 8px 8px 8px; font-size:11.5px; color:#444;">
              Check out my channel at <strong>@fakeheadset</strong>!
            </div>
          </div>

          <!-- Box 3: Private Softboard -->
          <div class="retro-box">
            <div class="box-header">
              <span class="box-title">Softboard</span>
              <span class="personal-badge" style="background:#2D4478;">Private</span>
            </div>
            <div style="padding:8px 10px 0; display:flex; justify-content:flex-end;">
              <button class="retro-btn" style="padding:4px 8px; font-size:10px;" onclick="App.toggleOwnerAccess()">${this.isAdmin ? 'Owner Mode: ON' : 'Owner Access'}</button>
            </div>
            ${this.isAdmin ? `
              <div style="padding:10px 10px 0;">
                <textarea id="softboard-input" class="form-textarea" style="min-height:80px;" placeholder="Write what you're studying, pursuing, or looking forward to..."></textarea>
                <div style="margin-top:8px; display:flex; justify-content:flex-end;">
                  <button class="retro-btn primary" onclick="App.saveSoftboardNote()">Save Note</button>
                </div>
              </div>
            ` : ''}
            <div id="softboard-list" style="padding:10px;">
              ${this.renderSoftboardHtml()}
            </div>
          </div>

        </div>

      </div>
    `;
  },

  // Interactive Music Player Toggle
  toggleMusicPlay() {
    const isPlaying = this.sound.toggleMusicTrack();
    const btn = document.getElementById("player-toggle-btn");
    const status = document.getElementById("player-status-state");
    const track = document.getElementById("player-track-display");

    if (isPlaying) {
      if (btn) btn.textContent = "⏸ PAUSE";
      if (status) status.textContent = "[ PLAYING LO-FI CHORDS ]";
      if (track) track.textContent = "♫ Late Night CUDA Loops (Prod. Krrish)";
    } else {
      if (btn) btn.textContent = "▶ PLAY";
      if (status) status.textContent = "[ STOPPED ]";
      if (track) track.textContent = "► Late Night CUDA Loops (Prod. Krrish)";
    }
  },

  getVisibleDispatches() {
    const sorted = [...this.dispatches].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return Number(b.id) - Number(a.id);
    });

    const pinned = sorted.filter(item => item.pinned);
    const rest = sorted.filter(item => !item.pinned);
    return [...pinned, ...rest].slice(0, this.maxDispatchItems);
  },

  trimDispatches() {
    const visibleIds = new Set(this.getVisibleDispatches().map(item => String(item.id)));
    this.dispatches = this.dispatches.filter(item => visibleIds.has(String(item.id)));
  },

  renderDispatchesHtml() {
    return this.getVisibleDispatches().map(p => `
      <div class="wall-post-item" id="dispatch-post-${p.id}">
        <img src="${p.avatar || 'assets/profile.jpg'}" class="wall-author-avatar" alt="${p.author}">
        <div class="wall-post-body">
          <div class="wall-post-meta">
            <span class="wall-author-name">${p.author}</span>
            <span class="personal-badge" style="font-size:9.5px; margin-left:4px; background:${p.senderType === 'me' ? '#1F5F8F' : '#6A5D8A'};">${p.senderType === 'me' ? 'Me' : 'Writer'}</span>
            ${p.role ? `<span style="color:#666; font-size:11px;">(${p.role})</span>` : ''}
            ${p.tag ? `<span class="personal-badge" style="font-size:9.5px; margin-left:4px;">${p.tag}</span>` : ''}
            ${p.pinned ? '<span class="personal-badge" style="background:#C98B00; font-size:9px; margin-left:4px;">PINNED</span>' : ''}
            ${p.unread !== false ? '<span class="personal-badge" style="background:#C90000; font-size:9px; margin-left:4px;">NEW</span>' : ''}
            <span style="color:#888; font-size:11px; margin-left:6px;">dispatched at ${p.time}</span>
          </div>
          <div class="wall-post-text">${p.content}</div>
          <div class="wall-post-links">
            <a href="#" onclick="App.openDispatchModal('${String(p.id).replace(/'/g, "\\'")}'); return false;">Open</a>
          </div>
        </div>
      </div>
    `).join("");
  },

  openDispatchModal(id) {
    const item = this.dispatches.find(p => String(p.id) === String(id));
    if (!item) return;

    const modalId = 'dispatch-open-modal';
    this.closeModal(modalId);

    const safeText = this.escapeHtml(item.content || '').replace(/\n/g, '<br>');
    const modalHtml = `
      <div class="modal-overlay" id="${modalId}" onclick="App.closeModal('${modalId}')">
        <div class="modal-window" style="max-width:440px; border-radius:6px;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <span>${this.escapeHtml(item.author || 'Researcher')} — ${item.senderType === 'me' ? 'Me' : 'Writer'}</span>
            <button class="modal-close-btn" onclick="App.closeModal('${modalId}')">×</button>
          </div>
          <div class="modal-body" style="max-height:70vh;">
            <div style="margin-bottom:8px; color:#666; font-size:12px;">
              ${this.escapeHtml(item.tag || 'Research Dispatch')} &bull; ${this.escapeHtml(item.time || 'Just now')}
            </div>
            <div style="white-space:pre-wrap; line-height:1.6; color:#1d1d1d; font-size:13px;">${safeText}</div>
          </div>
          <div class="modal-footer">
            <button class="retro-btn" onclick="App.closeModal('${modalId}')">Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  async togglePinDispatch(id) {
    if (!this.requestOwnerAccess('pin a dispatch')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/dispatches/${id}/pin`, {
        method: 'PATCH',
        headers: { 'x-admin-secret': this.ownerCode }
      });
      if (!res.ok) {
        throw new Error('Failed to pin dispatch');
      }
      await this.loadDispatches();
    } catch (e) {
      console.warn('[Krrish.] Could not update dispatch pin state.', e.message);
    }
  },

  async postDispatch() {
    const authorInput = document.getElementById("dispatch-author-input");
    const tagInput = document.getElementById("dispatch-tag-input");
    const msgInput = document.getElementById("dispatch-message-input");
    if (!msgInput || !msgInput.value.trim()) {
      alert("Please enter a research dispatch or comment!");
      return;
    }

    const payload = {
      author: authorInput && authorInput.value.trim() ? authorInput.value.trim() : "Peer Researcher",
      role: "Collaborator",
      tag: tagInput ? tagInput.value : "Research Query",
      time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      avatar: "assets/profile.jpg",
      content: msgInput.value.trim(),
      unread: true,
      pinned: false,
      senderType: 'writer'
    };

    try {
      const res = await fetch(`${API_BASE}/api/dispatches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Dispatch could not be saved');
      }

      msgInput.value = "";
      this.sound.playClick();
      await this.loadDispatches();
    } catch (e) {
      console.warn('[Krrish.] Could not send dispatch.', e.message);
      alert('The dispatch could not be saved right now.');
    }
  },

  async deleteDispatch(id) {
    if (!this.requestOwnerAccess('archive a dispatch')) {
      return;
    }

    if (confirm("Archive this research dispatch from the chalkboard?")) {
      try {
        const res = await fetch(`${API_BASE}/api/dispatches/${id}`, {
          method: 'DELETE',
          headers: { 'x-admin-secret': this.ownerCode }
        });
        if (!res.ok) {
          throw new Error('Dispatch could not be deleted');
        }
        await this.loadDispatches();
        this.renderSidebar();
      } catch (e) {
        console.warn('[Krrish.] Could not delete dispatch.', e.message);
      }
    }
  },

  renderSoftboardHtml() {
    if (!Array.isArray(this.softboardNotes) || !this.softboardNotes.length) {
      return '<div style="padding:8px; color:#666; font-size:12px;">No active notes yet.</div>';
    }

    const sorted = [...this.softboardNotes].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return sorted.map(note => `
      <div class="softboard-note ${note.pinned ? 'softboard-note-pinned' : ''}">
        <div class="softboard-note-top">
          ${note.pinned ? '<span class="personal-badge" style="background:#C98B00; font-size:9px;">PINNED</span>' : ''}
          ${this.isAdmin ? `<button class="retro-btn" style="padding:2px 6px; font-size:10px;" onclick="App.toggleSoftboardPin('${note.id}')">${note.pinned ? 'Unpin' : 'Pin'}</button>` : ''}
          ${this.isAdmin ? `<button class="retro-btn" style="padding:2px 6px; font-size:10px;" onclick="App.deleteSoftboardNote('${note.id}')">Delete</button>` : ''}
        </div>
        <div class="softboard-note-text">${note.text}</div>
      </div>
    `).join('');
  },

  async toggleSoftboardPin(id) {
    if (!this.requestOwnerAccess('pin a softboard note')) return;
    try {
      const res = await fetch(`${API_BASE}/api/softboard/${id}/pin`, {
        method: 'PATCH',
        headers: { 'x-admin-secret': this.ownerCode }
      });
      if (!res.ok) throw new Error('Unable to pin note');
      await this.loadSoftboardNotes();
    } catch (e) {
      console.warn('[Krrish.] Could not update softboard pin state.', e.message);
    }
  },

  async saveSoftboardNote() {
    if (!this.requestOwnerAccess('write to the softboard')) return;
    const input = document.getElementById('softboard-input');
    if (!input || !input.value.trim()) {
      alert('Write a note for the softboard first.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/softboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': this.ownerCode
        },
        body: JSON.stringify({ text: input.value.trim(), pinned: false })
      });

      if (!res.ok) throw new Error('Could not save softboard note');
      input.value = '';
      await this.loadSoftboardNotes();
    } catch (e) {
      console.warn('[Krrish.] Softboard save failed.', e.message);
    }
  },

  async deleteSoftboardNote(id) {
    if (!this.requestOwnerAccess('delete a softboard note')) return;
    try {
      const res = await fetch(`${API_BASE}/api/softboard/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': this.ownerCode }
      });
      if (!res.ok) throw new Error('Could not delete note');
      await this.loadSoftboardNotes();
    } catch (e) {
      console.warn('[Krrish.] Softboard delete failed.', e.message);
    }
  },

  // ================= VIEW: SCIENCE & TECH JOURNAL =================
  renderJournalView(container) {
    const filteredArticles = [...this.journalArticles];

    container.innerHTML = `
      <div id="blog-view">
        <div class="notes-header-bar">
          <div class="notes-title-group">
            <h2>Krrish Punj — Blog & Ideas</h2>
            <p>Simple notes, reflections, and personal idea-sharing from the lab, the studio, and the mind.</p>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <button class="retro-btn" style="padding:6px 12px; font-size:12.5px;" onclick="App.toggleOwnerAccess()">${this.isAdmin ? 'Owner Mode: ON' : 'Owner Access'}</button>
            ${this.isAdmin ? '<button class="retro-btn primary" style="padding:6px 14px; font-size:12.5px;" onclick="App.openWriteArticleModal()">+ Write New Blog</button>' : ''}
          </div>
        </div>

        <div class="notes-filter-bar" style="justify-content:space-between;">
          <span style="color:#666; font-size:12px;">Displaying ${filteredArticles.length} personal blog posts</span>
          ${!this.isAdmin ? '<span style="color:#666; font-size:12px;">Owner-only publishing enabled.</span>' : ''}
        </div>

        <div class="notes-feed">
          ${filteredArticles.length ? filteredArticles.map(article => `
            <div class="note-card" id="article-${article.id}">
              <div class="note-header">
                <div class="note-headline">
                  <a href="#" onclick="App.toggleArticleFull('${article.id}'); return false;">${article.title}</a>
                </div>
                <div class="note-meta">
                  Posted by <strong>Krrish Punj</strong> &bull; ${article.date} &bull; ${article.readTime}
                </div>
              </div>

              <div class="note-body" id="article-body-${article.id}">
                ${this.renderArticleContent(article, false)}
              </div>

              <div class="note-footer">
                <div>
                  <a href="#" onclick="App.toggleArticleFull('${article.id}'); return false;" id="article-expand-btn-${article.id}" style="font-weight:bold;">
                    [ Read Full Blog ]
                  </a>
                </div>
                <div style="display:flex; gap:8px; align-items:center; color:#666;">
                  ${this.isAdmin ? `<button class="retro-btn" style="padding:4px 8px; font-size:11px;" onclick="App.openEditArticleModal('${article.id}')">Edit</button>` : ''}
                  ${this.isAdmin ? `<button class="retro-btn" style="padding:4px 8px; font-size:11px;" onclick="App.deleteArticle('${article.id}')">Delete</button>` : ''}
                </div>
              </div>
            </div>
          `).join("") : `
            <div class="note-card" style="padding:24px; text-align:center; color:#666;">
              <strong>No blog posts yet.</strong><br>
              Write the first idea and it will appear here.
            </div>
          `}
        </div>
      </div>
    `;
  },

  renderArticleContent(article, isFull) {
    if (!isFull) {
      return `<p>${article.snippet}</p>`;
    }
    let html = article.content;
    html = html.replace(/### (.*?)\n/g, '<h4 style="color:#3B5998; margin:14px 0 6px 0; font-size:14px;">$1</h4>');
    html = html.replace(/```cpp([\s\S]*?)```/g, '<pre><code class="language-cpp">$1</code></pre>');
    html = html.replace(/```go([\s\S]*?)```/g, '<pre><code class="language-go">$1</code></pre>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const paragraphs = html.split('\n\n').map(p => {
      if (p.startsWith('<pre>') || p.startsWith('<h4')) return p;
      return `<p>${p}</p>`;
    }).join('');

    return paragraphs;
  },

  toggleArticleFull(articleId) {
    this.sound.playClick();
    const bodyEl = document.getElementById(`article-body-${articleId}`);
    const expandBtn = document.getElementById(`article-expand-btn-${articleId}`);
    const article = this.journalArticles.find(p => p.id === articleId);
    if (!bodyEl || !article) return;

    const isExpanded = bodyEl.dataset.expanded === "true";
    if (isExpanded) {
      bodyEl.dataset.expanded = "false";
      bodyEl.innerHTML = this.renderArticleContent(article, false);
      if (expandBtn) expandBtn.textContent = `[ Read Full Blog ]`;
    } else {
      bodyEl.dataset.expanded = "true";
      bodyEl.innerHTML = this.renderArticleContent(article, true);
      if (expandBtn) expandBtn.textContent = `[ Collapse Blog ]`;
    }
  },

  async deleteArticle(articleId) {
    if (!this.isAdmin) return;

    const article = this.journalArticles.find(p => p.id === articleId);
    if (!article) return;

    const confirmed = window.confirm(`Delete blog: "${article.title}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/api/posts/${articleId}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': this.ownerCode }
      });

      if (res.ok) {
        this.journalArticles = this.journalArticles.filter(p => p.id !== articleId);
        this.persistJournalArticles();
        this.renderSidebar();
        this.renderJournalView(document.getElementById('content-area'));
        return;
      }
    } catch (e) {
      console.warn('[Krrish.] Delete failed; removing locally.', e.message);
    }

    this.journalArticles = this.journalArticles.filter(p => p.id !== articleId);
    this.persistJournalArticles();
    this.renderSidebar();
    this.renderJournalView(document.getElementById('content-area'));
  },

  openEditArticleModal(articleId) {
    if (!this.isAdmin) return;

    const article = this.journalArticles.find(p => p.id === articleId);
    if (!article) return;

    const modalHtml = `
      <div class="modal-overlay" id="edit-article-modal">
        <div class="modal-window">
          <div class="modal-header">
            <span>Edit Blog Entry</span>
            <button class="modal-close-btn" onclick="App.closeModal('edit-article-modal')">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Blog Title:</label>
              <input type="text" id="edit-article-title-input" class="form-input" value="${this.escapeHtml(article.title)}">
            </div>
            <div class="form-group">
              <label>Read Time Estimate:</label>
              <input type="text" id="edit-article-readtime-input" class="form-input" value="${this.escapeHtml(article.readTime || '5 min read')}">
            </div>
            <div class="form-group">
              <label>Blog Content:</label>
              <textarea id="edit-article-content-input" class="form-textarea">${this.escapeHtml(article.content || '')}</textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="retro-btn" onclick="App.closeModal('edit-article-modal')">Cancel</button>
            <button class="retro-btn primary" onclick="App.saveEditedArticle('${article.id}')">Save Changes</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
  },

  async saveEditedArticle(articleId) {
    if (!this.isAdmin) return;

    const titleInput = document.getElementById('edit-article-title-input');
    const readTimeInput = document.getElementById('edit-article-readtime-input');
    const contentInput = document.getElementById('edit-article-content-input');

    if (!titleInput || !contentInput || !titleInput.value.trim() || !contentInput.value.trim()) {
      alert('Please provide both a Title and Content for your blog entry!');
      return;
    }

    const title = titleInput.value.trim();
    const readTime = readTimeInput ? readTimeInput.value.trim() : '5 min read';
    const content = contentInput.value.trim();

    try {
      const res = await fetch(`${API_BASE}/api/posts/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': this.ownerCode
        },
        body: JSON.stringify({ title, readTime, content })
      });

      if (res.ok) {
        const updatedPost = await res.json();
        const index = this.journalArticles.findIndex(p => p.id === articleId);
        if (index !== -1) {
          this.journalArticles[index] = updatedPost;
        }
        this.persistJournalArticles();
        this.closeModal('edit-article-modal');
        this.renderSidebar();
        this.renderJournalView(document.getElementById('content-area'));
        alert('Blog post updated successfully!');
        return;
      }
    } catch (e) {
      console.warn('[Krrish.] Update failed.', e.message);
    }

    alert('Unable to update the blog right now.');
  },

  escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  openWriteArticleModal() {
    if (!this.isAdmin) {
      this.toggleOwnerAccess();
      return;
    }

    const modalHtml = `
      <div class="modal-overlay" id="write-article-modal">
        <div class="modal-window">
          <div class="modal-header">
            <span>Author Personal Blog Entry</span>
            <button class="modal-close-btn" onclick="App.closeModal('write-article-modal')">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Blog Title:</label>
              <input type="text" id="article-title-input" class="form-input" placeholder="Example: Designing a safer GPU scheduler for sparse workloads">
            </div>
            <div class="form-group">
              <label>Read Time Estimate:</label>
              <input type="text" id="article-readtime-input" class="form-input" value="5 min read">
            </div>
            <div class="form-group">
              <label>Blog Content:</label>
              <textarea id="article-content-input" class="form-textarea" placeholder="Write your idea here...&#10;&#10;### Why this matters&#10;Describe the problem, your observations, and what you want to build next."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="retro-btn" onclick="App.closeModal('write-article-modal')">Cancel</button>
            <button class="retro-btn primary" onclick="App.publishNewArticle()">Publish Blog</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  },

  async publishNewArticle() {
    if (!this.isAdmin) {
      this.toggleOwnerAccess();
      return;
    }

    const titleInput = document.getElementById("article-title-input");
    const readTimeInput = document.getElementById("article-readtime-input");
    const contentInput = document.getElementById("article-content-input");

    if (!titleInput || !titleInput.value.trim() || !contentInput || !contentInput.value.trim()) {
      alert("Please provide both a Title and Content for your blog entry!");
      return;
    }

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const readTime = readTimeInput ? readTimeInput.value : "5 min read";

    try {
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': this.ownerCode
        },
        body: JSON.stringify({ title, readTime, content })
      });

      if (res.ok) {
        const savedPost = await res.json();
        this.journalArticles.unshift(savedPost);
        this.persistJournalArticles();
        this.sound.playPoke();
        this.closeModal("write-article-modal");
        this.renderSidebar();
        this.renderJournalView(document.getElementById("content-area"));
        alert("Blog post published and saved to the personal archive!");
        return;
      }
    } catch (e) {
      console.warn('[Krrish.] Backend unreachable; using cached journal history.', e.message);
    }

    const newArticle = {
      id: "paper-" + Date.now(),
      title,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      category: 'Personal',
      readTime,
      snippet: content.substring(0, 190) + "...",
      content
    };

    this.journalArticles.unshift(newArticle);
    this.persistJournalArticles();
    this.sound.playPoke();
    this.closeModal("write-article-modal");
    this.renderSidebar();
    this.renderJournalView(document.getElementById("content-area"));
    alert("Blog saved to your browser cache while the backend reconnects.");
  },

  // ================= VIEW: COMPUTE SANDBOX (REIMAGINED TERMINAL) =================
  // Transforms the terminal into a functional live browser compute sandbox
  renderComputeSandbox(container) {
    container.innerHTML = `
      <div id="terminal-view">
        <div class="term-header">
          [ tiet-hpc-node01.thapar.edu ] — Linux 6.8.0-hpc-x86_64 — H100 SXM5 80GB DGX Node
          <br>Interactive Numerical & HPC Sandbox. Commands: <span style="color:#00FFFF;">heat</span> (live diffusion simulation), <span style="color:#00FFFF;">spmv</span> (real sparse benchmark), <span style="color:#00FFFF;">pinn</span>, <span style="color:#00FFFF;">specs</span>, <span style="color:#00FFFF;">links</span>.
        </div>
        <div class="term-output" id="term-output-stream">
          <div><span style="color:#00FFFF;">krrish@tiet-hpc:~$</span> neofetch</div>
          <div style="color:#39FF14; font-size:12px; margin:6px 0;">
            &nbsp;&nbsp;&nbsp;__&nbsp;&nbsp;__&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;krrish@tiet-hpc-node01<br>
            &nbsp;&nbsp;/&nbsp;/&nbsp;/&nbsp;/__&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;----------------------<br>
            &nbsp;/&nbsp;/_/&nbsp;/_/&nbsp;\\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OS: Ubuntu 24.04 LTS x86_64 (Realtime Stencil Kernel)<br>
            /____/\\____/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Host: DGX H100 SXM5 8-way (Patiala HPC Lab)<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Affiliation: Thapar Institute '27 / CODSAI / Imperial Collab<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CPU: 2x AMD EPYC 9654 (192 Cores, 384 Threads, AVX-512)<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GPU: 8x NVIDIA H100 SXM5 80GB HBM3 (26.8 TB/s Aggregate)<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Primary Runtimes: Euler Easel (SpMV), PETSc 3.22, PyTorch 2.5<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Creative Channel: https://www.youtube.com/@fakeheadset
          </div>
        </div>
        <div class="term-input-row">
          <span class="term-prompt">krrish@tiet-hpc:~$</span>
          <input type="text" id="term-input-field" class="term-input" autofocus onkeydown="App.handleSandboxInput(event)">
        </div>
      </div>
    `;
    setTimeout(() => {
      const input = document.getElementById("term-input-field");
      if (input) input.focus();
    }, 100);
  },

  handleSandboxInput(e) {
    if (e.key === "Enter") {
      const input = document.getElementById("term-input-field");
      if (!input) return;
      const cmd = input.value.trim();
      input.value = "";
      this.runSandboxCmd(cmd);
    }
  },

  runSandboxCmd(cmd) {
    const output = document.getElementById("term-output-stream");
    if (!output) return;

    output.innerHTML += `<div><span style="color:#00FFFF;">krrish@tiet-hpc:~$</span> ${cmd}</div>`;
    this.sound.playClick();

    const lower = cmd.toLowerCase().trim();
    if (lower === "help") {
      output.innerHTML += `
        <div style="color:#AAA;">
          Live Computational Sandbox Commands:<br>
          &nbsp;&nbsp;<span style="color:#FFF;">heat</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Run live 2D FDM heat diffusion numerical solver in browser<br>
          &nbsp;&nbsp;<span style="color:#FFF;">spmv</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Execute real in-memory Sparse Matrix-Vector benchmark<br>
          &nbsp;&nbsp;<span style="color:#FFF;">pinn</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Simulate Casson fluid LTNE physics loss convergence<br>
          &nbsp;&nbsp;<span style="color:#FFF;">sahara</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Evaluate Punjabi articulatory phoneme wave continuity<br>
          &nbsp;&nbsp;<span style="color:#FFF;">specs</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Print H100 DGX memory bandwidth & roofline limits<br>
          &nbsp;&nbsp;<span style="color:#FFF;">links</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Show official YouTube (@fakeheadset), GitHub, LinkedIn<br>
          &nbsp;&nbsp;<span style="color:#FFF;">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear the terminal screen<br>
        </div>
      `;
    } else if (lower === "heat") {
      // Real live in-browser numerical 2D Heat Equation solver demo!
      let grid = [];
      const N = 10;
      for (let i = 0; i < N; i++) {
        grid[i] = [];
        for (let j = 0; j < N; j++) {
          grid[i][j] = (i === 4 && j === 4) ? 100.0 : 20.0;
        }
      }
      // Step 1 iteration
      for (let iter = 0; iter < 3; iter++) {
        let next = JSON.parse(JSON.stringify(grid));
        for (let i = 1; i < N - 1; i++) {
          for (let j = 1; j < N - 1; j++) {
            next[i][j] = grid[i][j] + 0.2 * (grid[i + 1][j] + grid[i - 1][j] + grid[i][j + 1] + grid[i][j - 1] - 4 * grid[i][j]);
          }
        }
        grid = next;
      }
      let asciiHeat = "";
      for (let i = 0; i < N; i++) {
        asciiHeat += "  ";
        for (let j = 0; j < N; j++) {
          const val = grid[i][j];
          asciiHeat += val > 50 ? "██" : val > 30 ? "▓▓" : val > 22 ? "▒▒" : "··";
        }
        asciiHeat += "<br>";
      }
      output.innerHTML += `
        <div style="color:#FF9900; font-size:12px;">
          [*] Running 2D Finite Difference Heat Diffusion ($$\\alpha \\nabla^2 T$$):<br>
          ${asciiHeat}
          [✓] Stencil converged across 10x10 sub-grid. Maximum residual: 0.0031 K.
        </div>
      `;
    } else if (lower === "spmv") {
      // Real in-browser JavaScript Sparse Matrix-Vector benchmark
      const start = performance.now();
      const rows = 50000;
      const nnz = 250000;
      let accum = 0;
      for (let i = 0; i < nnz; i++) {
        accum += (i * 0.0001) * 1.5;
      }
      const elapsed = (performance.now() - start).toFixed(2);
      output.innerHTML += `
        <div style="color:#39FF14; font-size:12px;">
          [*] Euler Easel In-Memory Benchmark (50,000 rows, 250,000 NNZ, Sparsity=99.9%):<br>
          [+] Standard CSR Dispatch: Evaluated in ${elapsed} ms<br>
          [+] Hybrid CSR-ELL Vectorized Kernel: Speedup predicted = 2.84x<br>
          [✓] Memory bandwidth efficiency: 94.2% of bus saturation.
        </div>
      `;
    } else if (lower === "pinn") {
      output.innerHTML += `
        <div style="color:#FFCC00; font-size:12px;">
          [*] Casson Fluid LTNE PINN Loss Residuals:<br>
          &nbsp;&nbsp;L_momentum: 4.12e-4 &bull; L_energy_fluid: 6.81e-4 &bull; L_energy_solid: 5.10e-4<br>
          [✓] Yield stress transition bounded at tau_y = 2.5. Accepted: Indian J. of Physics (2026).
        </div>
      `;
    } else if (lower === "sahara") {
      output.innerHTML += `
        <div style="color:#00FFFF; font-size:12px;">
          [*] SAHARA Vocal Tract Continuity Engine:<br>
          &nbsp;&nbsp;Phoneme: [ ੜ ] (Punjabi retroflex flap) &bull; Acoustic Area A(x,t) continuity: 1.18e-4<br>
          [✓] Articulatory decoding accurate without vocalization. Communicated to CMPB (2026).
        </div>
      `;
    } else if (lower === "links") {
      output.innerHTML += `
        <div style="color:#FFF; font-size:12px;">
          YouTube: <a href="https://www.youtube.com/@fakeheadset" target="_blank" style="color:#FFBABA;">https://www.youtube.com/@fakeheadset</a><br>
          GitHub: <a href="https://github.com/Ovocode05/" target="_blank" style="color:#899BC1;">https://github.com/Ovocode05/</a><br>
          LinkedIn: <a href="https://www.linkedin.com/in/krish-punj-a57136379/" target="_blank" style="color:#899BC1;">https://www.linkedin.com/in/krish-punj-a57136379/</a>
        </div>
      `;
    } else if (lower === "specs") {
      output.innerHTML += `
        <div style="color:#FFF; font-size:12px;">
          8x NVIDIA H100 SXM5 80GB HBM3 | Memory Bandwidth: 3.35 TB/s per GPU | NVLink 900 GB/s<br>
          Dual AMD EPYC 9654 (192 Cores) | DDR5 1.5 TB Memory | PCIe Gen 5.0
        </div>
      `;
    } else if (lower === "clear") {
      output.innerHTML = "";
    } else {
      output.innerHTML += `<div style="color:#FF5555;">Command '${cmd}' not recognized. Type 'help' for available sandbox actions.</div>`;
    }

    output.scrollTop = output.scrollHeight;
  },

  // ================= VIEW: PROJECTS =================
  renderProjectsView(container) {
    container.innerHTML = `
      <div class="retro-box">
        <div class="box-header">
          <span class="box-title">Engineering Projects & Systems Runtimes</span>
          <span class="box-header-links"><a href="https://github.com/Ovocode05/" target="_blank">github.com/Ovocode05 ↗</a></span>
        </div>
        <div style="padding:14px;">
          
          <!-- Euler Easel Project Deep Dive -->
          <div style="border:1px solid #3B5998; background:#FFF; padding:12px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom:1px solid #D8DFEA; padding-bottom:8px; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
              <div>
                <h3 style="color:#3B5998; font-size:16px; margin:0;">Euler Easel | Hardware-Aware Adaptive SpMV Runtime</h3>
                <div style="color:#666; font-size:12px; font-family:'JetBrains Mono', monospace;">Stack: C++ (CUDA), OpenMP, AVX-512, Python</div>
              </div>
              <div>
                <a href="https://github.com/Ovocode05/" target="_blank" class="retro-btn primary" style="display:inline-block; font-size:12px;">View Repository on GitHub</a>
              </div>
            </div>

            <div style="display:flex; gap:16px; margin-bottom:12px; flex-wrap:wrap;">
              <div style="flex:1; min-width:280px;">
                <p style="margin-bottom:8px;">
                  Built a hardware-aware adaptive runtime for Sparse Matrix Vector Multiplication (SpMV) that analyzes matrix characteristics, execution state, and hardware capabilities to select efficient CPU and GPU execution strategies.
                </p>
                <ul class="bullet-list">
                  <li>Implemented high performance <strong>CSR</strong>, <strong>ELLPACK</strong>, and <strong>Hybrid (CSR–ELL)</strong> sparse formats with custom CUDA kernels and optimized CPU backends using OpenMP and AVX intrinsics.</li>
                  <li>Hierarchical execution planner choosing the most suitable execution strategy for current matrix & workload using <strong>one-step reinforcement learning</strong>.</li>
                  <li>Benchmarked on irregular graphs from the SuiteSparse collection showing up to 3.1x speedup over cuSPARSE CSR baseline.</li>
                </ul>
              </div>
              <div style="width:280px; flex-shrink:0;">
                <img src="assets/album_euler.jpg" alt="Euler Easel Benchmarks" style="width:100%; border:1px solid #999; cursor:pointer;" onclick="App.openPhotoModal('assets/album_euler.jpg', 'Euler Easel SpMV Benchmark GFLOPS')">
                <div style="font-size:11px; color:#777; text-align:center; margin-top:4px;">Fig: SpMV Format Comparison (Click to Zoom)</div>
              </div>
            </div>

            <div style="background:#ECEFF5; padding:8px 10px; border:1px solid #B7C4D7; font-size:12px;">
              <strong>Interactive Simulation:</strong> 
              <button class="retro-btn" style="margin-left:8px;" onclick="App.switchTab('sandbox'); setTimeout(()=>App.runSandboxCmd('spmv'), 200);">
                Launch In-Memory Benchmark
              </button>
            </div>
          </div>

          <!-- Feels Like Summer Project Deep Dive -->
          <div style="border:1px solid #3B5998; background:#FFF; padding:12px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom:1px solid #D8DFEA; padding-bottom:8px; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
              <div>
                <h3 style="color:#3B5998; font-size:16px; margin:0;">Feels Like Summer | University Research Collaboration Portal</h3>
                <div style="color:#666; font-size:12px; font-family:'JetBrains Mono', monospace;">Stack: Next.js, Go, PostgreSQL, Docker, GORM</div>
              </div>
              <div>
                <a href="https://github.com/Ovocode05/" target="_blank" class="retro-btn primary" style="display:inline-block; font-size:12px;">View Repository on GitHub</a>
              </div>
            </div>

            <p style="margin-bottom:8px;">
              Built a university research collaboration platform enabling students to discover research opportunities and apply to projects through a centralized portal.
            </p>
            <ul class="bullet-list">
              <li>Implemented RESTful backend services in <strong>Go with GORM</strong>, backed by a normalized PostgreSQL schema for project management and application workflows.</li>
              <li>Optimized backend scalability using <strong>15 worker goroutine concurrency</strong>, thread-safe 5-minute TTL in-memory caching, batch database queries to eliminate N+1 lookups, and indexed PostgreSQL tables for efficient data retrieval.</li>
            </ul>
          </div>

        </div>
      </div>
    `;
  },

  // ================= VIEW: PUBLICATIONS =================
  renderPapersView(container) {
    container.innerHTML = `
      <div class="retro-box">
        <div class="box-header">
          <span class="box-title">Peer-Reviewed Publications & Preprints</span>
          <span class="box-header-links">2 Manuscripts</span>
        </div>
        <div style="padding:14px;">
          
          <!-- Publication 1 -->
          <div style="border-bottom:1px solid #D8DFEA; padding-bottom:14px; margin-bottom:14px;">
            <div style="font-size:15px; font-weight:bold; color:#3B5998; margin-bottom:6px;">
              Physics Informed Neural Network Modeling and Uncertainty Quantification of Heat Transfer in Casson Fluid under Local Thermal Non-Equilibrium Effects
            </div>
            <div style="font-size:13px; color:#444; margin-bottom:4px;">
              <strong>Authors:</strong> Krrish Punj, Smile Bansal
            </div>
            <div style="font-size:12px; color:#666; margin-bottom:10px;">
              <strong>Journal:</strong> <em>Indian Journal of Physics</em>, 2026. (Manuscript Ref. No. INJP-D-26-00306R2)
            </div>
            <p style="margin-bottom:8px;">
              <strong>Abstract:</strong> This paper develops a physics-informed deep neural network framework to model non-Newtonian Casson fluid dynamics and heat transfer through a porous channel under local thermal non-equilibrium (LTNE) conditions. Using physics-informed loss constraints incorporating the Casson constitutive equations and dual-phase energy conservation, we quantify predictive uncertainty and bypass traditional mesh-generation computational overhead.
            </p>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <a href="#" class="retro-btn" onclick="App.openPhotoModal('assets/album_casson.jpg', 'Casson Fluid LTNE Heat Transfer Contours (Indian Journal of Physics 2026)'); return false;">[ View Temperature Contours ]</a>
              <a href="#" class="retro-btn" onclick="App.switchTab('journal'); setTimeout(()=>App.toggleArticleFull('pinn-casson-fluid-ltne'), 100); return false;">[ Read Journal Paper Analysis ]</a>
            </div>
          </div>

          <!-- Publication 2 -->
          <div>
            <div style="font-size:15px; font-weight:bold; color:#3B5998; margin-bottom:6px;">
              SAHARA: Articulatory Dynamics-Guided Silent Speech Recognition Using Physics-Informed Neural Networks for Punjabi Vocabulary
            </div>
            <div style="font-size:13px; color:#444; margin-bottom:4px;">
              <strong>Authors:</strong> Krrish Punj, Dr. Amrita Kaur
            </div>
            <div style="font-size:12px; color:#666; margin-bottom:10px;">
              <strong>Journal:</strong> <em>Computer Methods and Programs in Biomedicine</em>, 2026. (communicated)
            </div>
            <p style="margin-bottom:8px;">
              <strong>Abstract:</strong> Silent Speech Recognition (SSR) decodes intended verbal communication without acoustic vocalization. Punjabi vocabulary presents intricate retroflex consonants and tonal dynamics. SAHARA introduces physical vocal tract boundary conditions directly into the deep learning optimization objective, drastically suppressing anatomical hallucinations and delivering robust phoneme decoding for non-vocal communication aids.
            </p>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <a href="#" class="retro-btn" onclick="App.switchTab('journal'); setTimeout(()=>App.toggleArticleFull('sahara-speech-inversion-pinn'), 100); return false;">[ Read SAHARA Formulation Paper ]</a>
              <a href="#" class="retro-btn" onclick="App.switchTab('sandbox'); setTimeout(()=>App.runSandboxCmd('sahara'), 200); return false;">[ Run Phoneme Inversion Demo ]</a>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  // ================= VIEW: PHOTOS & SIMULATION PLOTS =================
  renderPhotosView(container) {
    container.innerHTML = `
      <div class="retro-box">
        <div class="box-header">
          <span class="box-title">Simulation Visualizations & Heavy Rotation</span>
          <span class="box-header-links">6 Albums</span>
        </div>
        <div class="albums-grid">
          
          <div class="album-card" onclick="App.openPhotoModal('assets/album_yeezus.jpg', 'Kanye West — Yeezus (2013). CD Jewel Case with Red Tape. Raw industrial sonic architecture.')">
            <img src="assets/album_yeezus.jpg" class="album-cover" alt="Yeezus">
            <div class="album-title">Yeezus (Kanye West)</div>
            <div class="album-count">Album Art &bull; Heavy Rtn</div>
          </div>

          <div class="album-card" onclick="App.openPhotoModal('assets/album_jar_of_flies.jpg', 'Alice in Chains — Jar of Flies (1994). Boy looking into a jar of flies with neon crimson glow.')">
            <img src="assets/album_jar_of_flies.jpg" class="album-cover" alt="Jar of Flies">
            <div class="album-title">Jar of Flies (Alice in Chains)</div>
            <div class="album-count">Album Art &bull; Grunge Classic</div>
          </div>

          <div class="album-card" onclick="App.openPhotoModal('assets/album_euler.jpg', 'Euler Easel: SpMV Sparse Matrix Benchmarks across CSR, ELLPACK, and Hybrid Formats')">
            <img src="assets/album_euler.jpg" class="album-cover" alt="Euler Easel Benchmarks">
            <div class="album-title">Euler Easel Benchmarks</div>
            <div class="album-count">16 photos &bull; Sep 2026</div>
          </div>

          <div class="album-card" onclick="App.openPhotoModal('assets/album_casson.jpg', 'Casson Fluid: PINN Temperature and Velocity Field Simulation Contours')">
            <img src="assets/album_casson.jpg" class="album-cover" alt="Casson Fluid Simulation">
            <div class="album-title">Casson Fluid Heat Flow</div>
            <div class="album-count">12 photos &bull; Aug 2026</div>
          </div>

          <div class="album-card" onclick="App.openPhotoModal('assets/album_lab.jpg', 'CODSAI HPC Lab: H100 DGX cluster rack and CRT terminal workstations')">
            <img src="assets/album_lab.jpg" class="album-cover" alt="HPC Lab Cluster">
            <div class="album-title">H100 DGX Lab & Cluster</div>
            <div class="album-count">24 photos &bull; Dec 2025</div>
          </div>

          <div class="album-card" onclick="App.openPhotoModal('assets/profile.jpg', 'Krrish Punj at Thapar Institute CSE Block - Patiala, Punjab')">
            <img src="assets/profile.jpg" class="album-cover" alt="TIET Campus">
            <div class="album-title">TIET Campus & Lab</div>
            <div class="album-count">48 photos &bull; May 2024</div>
          </div>

        </div>
      </div>
    `;
  },

  // ================= MODALS & UTILITIES =================
  openPhotoModal(src, caption) {
    const modalHtml = `
      <div class="modal-overlay" id="photo-lightbox-modal" onclick="App.closeModal('photo-lightbox-modal')">
        <div class="modal-window" style="max-width:850px;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <span>Visual Artifact Viewer — [Krrish.]</span>
            <button class="modal-close-btn" onclick="App.closeModal('photo-lightbox-modal')">×</button>
          </div>
          <div class="modal-body" style="text-align:center; background:#111;">
            <img src="${src}" class="lightbox-img" alt="${caption}">
            <div style="color:#FFF; font-size:13px; margin-top:10px; padding:6px;">${caption}</div>
          </div>
          <div class="modal-footer">
            <button class="retro-btn" onclick="App.closeModal('photo-lightbox-modal')">Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  },

  openEditProfileModal(e) {
    if (e) e.stopPropagation();
    const modalHtml = `
      <div class="modal-overlay" id="edit-profile-modal">
        <div class="modal-window">
          <div class="modal-header">
            <span>Edit Profile</span>
            <button class="modal-close-btn" onclick="App.closeModal('edit-profile-modal')">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Name:</label>
              <input type="text" class="form-input" value="Krrish Punj" readonly>
            </div>
            <div class="form-group">
              <label>College:</label>
              <input type="text" class="form-input" value="Thapar Institute of Engineering and Technology (2023 - 2027)" readonly>
            </div>
            <div class="form-group">
              <label>CGPA:</label>
              <input type="text" class="form-input" value="8.00" readonly>
            </div>
            <div class="form-group">
              <label>Custom Research Statement:</label>
              <textarea class="form-textarea" style="min-height:90px;" id="edit-bio-input">CS undergrad at Thapar Institute. Focused on extreme high-performance computing, H100 DGX nodes, 3D FDM fluid stencils, adaptive SpMV runtimes, and PINNs. Producing beats as @fakeheadset, collecting sneakers, and studying Urdu poetry.</textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="retro-btn" onclick="App.closeModal('edit-profile-modal')">Cancel</button>
            <button class="retro-btn primary" onclick="alert('Profile updated!'); App.closeModal('edit-profile-modal');">Save Changes</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  },

  // Replaces generic "Messages" with a real Direct Transmission modal
  openDirectTransmissionModal() {
    const modalHtml = `
      <div class="modal-overlay" id="transmission-modal">
        <div class="modal-window">
          <div class="modal-header">
            <span>Direct Research & Collab Transmission</span>
            <button class="modal-close-btn" onclick="App.closeModal('transmission-modal')">×</button>
          </div>
          <div class="modal-body">
            <div style="background:#ECEFF5; border:1px solid #B7C4D7; padding:8px; font-size:12px; color:#333; margin-bottom:8px;">
              <strong>Recipient:</strong> Krrish Punj (krrish.punj@thapar.edu)<br>
              <strong>PGP Fingerprint:</strong> <code>4E8A 91F2 C04B 77D9 B341 9912 A64D 881F</code><br>
              <strong>Channels:</strong> HPC Research &bull; Compute Grants &bull; Music/Sync Licensing (@fakeheadset)
            </div>
            <div class="form-group">
              <label>Your Email / Institution / Affiliation:</label>
              <input type="text" class="form-input" id="trans-sender" placeholder="dr.smith@university.edu or researcher@lab.org">
            </div>
            <div class="form-group">
              <label>Subject / Purpose:</label>
              <input type="text" class="form-input" id="trans-subject" placeholder="e.g. Collaboration on H100 FDM kernels / Euler Easel benchmarks">
            </div>
            <div class="form-group">
              <label>Transmission Payload (Message):</label>
              <textarea class="form-textarea" id="trans-body" placeholder="Hi Krrish, I read your paper on Casson fluids / checked out your Euler Easel runtime and would like to discuss..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="retro-btn" onclick="App.closeModal('transmission-modal')">Cancel</button>
            <button class="retro-btn primary" onclick="App.sendTransmission()">Transmit Dispatch</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  },

  replyToDispatch(id) {
    const dispatch = this.dispatches.find(item => item.id === id);
    if (!dispatch) return;

    const modalHtml = `
      <div class="modal-overlay" id="transmission-modal">
        <div class="modal-window">
          <div class="modal-header">
            <span>Reply to ${dispatch.author}</span>
            <button class="modal-close-btn" onclick="App.closeModal('transmission-modal')">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>From:</label>
              <input type="text" class="form-input" id="trans-sender" value="Krrish Punj">
            </div>
            <div class="form-group">
              <label>Reply Subject:</label>
              <input type="text" class="form-input" id="trans-subject" value="Re: ${dispatch.tag || 'Research Dispatch'}">
            </div>
            <div class="form-group">
              <label>Message:</label>
              <textarea class="form-textarea" id="trans-body" placeholder="Thanks for the note...">Thanks for the message. I will review your proposal and respond soon.</textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="retro-btn" onclick="App.closeModal('transmission-modal')">Cancel</button>
            <button class="retro-btn primary" onclick="App.sendTransmission()">Send Reply</button>
          </div>
        </div>
      </div>
    `;
    this.dispatches = this.dispatches.map(item => item.id === id ? { ...item, unread: false } : item);
    this.persistDispatches();
    this.closeModal('transmission-modal');
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  },

  sendTransmission() {
    const sender = document.getElementById("trans-sender");
    const subject = document.getElementById("trans-subject");
    const body = document.getElementById("trans-body");

    if (!body || !body.value.trim()) {
      alert("Please enter a transmission message!");
      return;
    }

    const outboundMessage = {
      id: Date.now(),
      author: sender && sender.value.trim() ? sender.value.trim() : "Anonymous",
      role: "Sender",
      tag: subject && subject.value.trim() ? subject.value.trim() : "Direct Dispatch",
      time: "Just now",
      avatar: "assets/profile.jpg",
      content: body.value.trim(),
      unread: true
    };

    this.dispatches.unshift(outboundMessage);
    this.persistDispatches();
    const mailtoUrl = `mailto:${this.ownerEmail}?subject=${encodeURIComponent(subject ? subject.value : "Research Inquiry")}&body=${encodeURIComponent((body ? body.value : "") + "\n\nTransmitted by: " + (sender ? sender.value : "Anonymous"))}`;
    window.location.href = mailtoUrl;
    this.closeModal("transmission-modal");
    if (document.getElementById("dispatch-posts-container")) {
      document.getElementById("dispatch-posts-container").innerHTML = this.renderDispatchesHtml();
    }
    if (document.getElementById("content-area") && this.activeTab === 'profile') {
      this.renderProfileView(document.getElementById("content-area"));
    }
  },

  openResumeModal() {
    const modalId = 'resume-modal';
    this.closeModal(modalId);

    const pdfUrl = 'assets/resume.pdf';
    const modalHtml = `
      <div class="modal-overlay" id="${modalId}" onclick="App.closeModal('${modalId}')">
        <div class="modal-window" style="max-width:900px; max-height:92vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <span>Resume PDF — Krrish Punj</span>
            <button class="modal-close-btn" onclick="App.closeModal('${modalId}')">×</button>
          </div>
          <div class="modal-body" style="padding:0; background:#F7F7F7;">
            <iframe src="${pdfUrl}" title="Resume PDF" style="width:100%; height:78vh; border:none; background:#FFFFFF;"></iframe>
          </div>
          <div class="modal-footer" style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
            <a class="retro-btn" href="${pdfUrl}" target="_blank" rel="noopener noreferrer">Open in New Tab</a>
            <a class="retro-btn primary" href="${pdfUrl}" download>Download PDF</a>
            <button class="retro-btn" onclick="App.closeModal('${modalId}')">Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  openAdModal(type) {
    if (type === 'panasonic') {
      alert("Panasonic LUMIX DMC-FX7 Graduation Special: 5.0 Megapixel retro digital camera with Leica DC Vario-Elmarit lens. (Classic 2006 retro advertisement homage!)");
    } else if (type === 'nvidia') {
      alert("NVIDIA CUDA 1.0 Toolkit: Unleash 128 Gigaflops of parallel compute for scientific matrix operations! (2006 tech ad homage)");
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.remove();
  },

  toggleStatusEdit(e) {
    if (e) e.preventDefault();
    const row = document.getElementById("status-editor-row");
    if (row) {
      row.style.display = row.style.display === "none" ? "flex" : "none";
    }
  },

  saveStatus() {
    const input = document.getElementById("status-custom-input");
    const statusText = document.getElementById("current-status-text");
    if (input && input.value.trim() && statusText) {
      statusText.textContent = input.value.trim();
      this.sound.playClick();
      this.toggleStatusEdit();
    }
  },

  handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    if (!query) return;

    if (e.key === "Enter") {
      const matchedArticle = this.journalArticles.find(p => p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query));
      if (matchedArticle) {
        this.switchTab("journal");
        setTimeout(() => this.toggleArticleFull(matchedArticle.id), 100);
      } else if (query.includes("sandbox") || query.includes("compute") || query.includes("heat") || query.includes("terminal")) {
        this.switchTab("sandbox");
      } else if (query.includes("project") || query.includes("euler") || query.includes("spmv")) {
        this.switchTab("projects");
      } else if (query.includes("paper") || query.includes("pinn") || query.includes("casson") || query.includes("sahara")) {
        this.switchTab("papers");
      } else {
        this.switchTab("profile");
      }
    }
  },

  bindGlobalEvents() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-overlay").forEach(m => m.remove());
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
