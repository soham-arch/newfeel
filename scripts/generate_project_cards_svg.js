const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'assets', 'svg', 'project_cards');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Common styles & defs for all cards
const getCommonHeader = (width, height) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;700;800;900&amp;family=Inter:wght@400;500&amp;family=JetBrains+Mono:wght@700&amp;display=swap');
      
      .card-bg {
        fill: #030712;
        stroke: #1e293b;
        stroke-width: 1.5;
        rx: 16px;
      }
      .card-border-glow {
        fill: none;
        stroke-width: 1.5;
        stroke-linecap: round;
      }
      .proj-title {
        font-family: 'Outfit', system-ui, sans-serif;
        font-weight: 900;
        font-size: 26px;
        fill: #ffffff;
        letter-spacing: -0.02em;
      }
      .proj-desc {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 13px;
        fill: #94a3b8;
        font-weight: 400;
      }
      .status-text {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .tag-bg {
        fill: #0d1527;
        stroke: #1e293b;
        stroke-width: 1;
        rx: 6px;
      }
      .tag-text {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 10.5px;
        font-weight: 500;
        fill: #64748b;
      }
      .cta-text {
        font-family: 'Outfit', system-ui, sans-serif;
        font-size: 11px;
        font-weight: 700;
        fill: #38bdf8;
        letter-spacing: 0.05em;
      }
      
      /* Subtle animations */
      .glowing-node {
        animation: pulseGlow 4s ease-in-out infinite alternate;
      }
      @keyframes pulseGlow {
        0% { fill-opacity: 0.2; r: 8; }
        100% { fill-opacity: 0.5; r: 14; }
      }
      .float-illustration {
        animation: floatIllus 5s ease-in-out infinite alternate;
      }
      @keyframes floatIllus {
        0% { transform: translateY(0px) rotate(0deg); }
        100% { transform: translateY(-6px) rotate(1deg); }
      }
      .dash-flow {
        stroke-dasharray: 6 10;
        animation: flowMarch 25s linear infinite;
      }
      @keyframes flowMarch {
        0% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: -500; }
      }
    </style>

    <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="100%" stop-color="#0b1329" />
    </linearGradient>

    <linearGradient id="mindmirror-glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>

    <linearGradient id="crimeface-glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#f43f5e" />
    </linearGradient>

    <linearGradient id="turfly-glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>

    <pattern id="card-grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="0.5" stroke-opacity="0.12" />
    </pattern>
  </defs>
`;

// 1. MindMirror Card
const renderMindMirror = () => {
  const width = 800;
  const height = 175;
  
  return `
  ${getCommonHeader(width, height)}
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#card-grad)" class="card-bg" />
  <rect width="${width}" height="${height}" fill="url(#card-grid)" rx="16" />
  
  <!-- Glowing border line -->
  <path d="M 30 0 L 150 0" stroke="url(#mindmirror-glow)" stroke-width="2.5" stroke-linecap="round" />
  
  <!-- Content Group -->
  <g transform="translate(40, 30)">
    <!-- Status Badge -->
    <g transform="translate(0, 0)">
      <rect width="90" height="18" rx="4" fill="#0d1b3e" stroke="#1e3a8a" stroke-width="0.75" />
      <circle cx="10" cy="9" r="2.5" fill="#38bdf8" />
      <text x="20" y="12" class="status-text" fill="#38bdf8">Refining AI</text>
    </g>

    <!-- Title -->
    <text x="0" y="44" class="proj-title">MindMirror</text>
    
    <!-- Description -->
    <text x="0" y="70" class="proj-desc">AI-powered mental well-being tracker analyzing emotional journaling patterns,</text>
    <text x="0" y="88" class="proj-desc">extracting cognitive distortions, and generating diagnostic sentiment logs.</text>

    <!-- Tech Tags -->
    <g transform="translate(0, 106)">
      <!-- React -->
      <g transform="translate(0, 0)">
        <rect width="60" height="20" class="tag-bg" />
        <text x="12" y="14" class="tag-text">React</text>
      </g>
      <!-- Node.js -->
      <g transform="translate(66, 0)">
        <rect width="70" height="20" class="tag-bg" />
        <text x="12" y="14" class="tag-text">Node.js</text>
      </g>
      <!-- NLP Python -->
      <g transform="translate(142, 0)">
        <rect width="95" height="20" class="tag-bg" />
        <text x="12" y="14" class="tag-text">Python (NLP)</text>
      </g>
      <!-- Firebase -->
      <g transform="translate(243, 0)">
        <rect width="75" height="20" class="tag-bg" />
        <text x="12" y="14" class="tag-text">Firebase</text>
      </g>
    </g>
  </g>

  <!-- Graphic Illustration (Right Aligned) -->
  <g class="float-illustration" transform="translate(620, 85)">
    <!-- Mirror Circle base -->
    <circle cx="0" cy="0" r="50" fill="none" stroke="#1e293b" stroke-width="1.5" />
    <circle cx="0" cy="0" r="40" fill="none" stroke="#1e3a8a" stroke-width="1" stroke-dasharray="3 3" />
    
    <!-- Waves crossing the mirror (representing thoughts) -->
    <path d="M-45,-15 C-20,-30 20,-5 45,-20" fill="none" stroke="url(#mindmirror-glow)" stroke-width="2.5" class="dash-flow" />
    <path d="M-45,15 C-20,5 20,30 45,10" fill="none" stroke="url(#mindmirror-glow)" stroke-width="1.5" opacity="0.6"/>

    <!-- Glowing sentiment nodes -->
    <circle cx="-10" cy="-18" r="10" fill="#38bdf8" fill-opacity="0.1" class="glowing-node" />
    <circle cx="-10" cy="-18" r="4" fill="#38bdf8" />

    <circle cx="15" cy="18" r="10" fill="#6366f1" fill-opacity="0.1" class="glowing-node" style="animation-delay:-2s;" />
    <circle cx="15" cy="18" r="4" fill="#6366f1" />
  </g>

  <!-- Interactive CTA link indicator -->
  <g transform="translate(40, 155)">
    <text x="0" y="0" class="cta-text">EXPLORE REPOSITORY &amp; ARCHITECTURE →</text>
  </g>
</svg>
`;
};

// 2. CrimeFace Card
const renderCrimeFace = () => {
  const width = 800;
  const height = 175;
  
  return `
  ${getCommonHeader(width, height)}
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#card-grad)" class="card-bg" />
  <rect width="${width}" height="${height}" fill="url(#card-grid)" rx="16" />
  
  <!-- Glowing border line -->
  <path d="M 30 0 L 150 0" stroke="url(#crimeface-glow)" stroke-width="2.5" stroke-linecap="round" />
  
  <!-- Content Group -->
  <g transform="translate(40, 30)">
    <!-- Status Badge -->
    <g transform="translate(0, 0)">
      <rect width="115" height="18" rx="4" fill="#2d0f15" stroke="#991b1b" stroke-width="0.75" />
      <circle cx="10" cy="9" r="2.5" fill="#f43f5e" />
      <text x="20" y="12" class="status-text" fill="#f43f5e">Production Ready</text>
    </g>

    <!-- Title -->
    <text x="0" y="44" class="proj-title">CrimeFace</text>
    
    <!-- Description -->
    <text x="0" y="70" class="proj-desc">Deep learning-powered facial indexing framework executing sub-millisecond</text>
    <text x="0" y="88" class="proj-desc">suspect profile matching against a Milvus vector similarity index.</text>

    <!-- Tech Tags -->
    <g transform="translate(0, 106)">
      <!-- Python -->
      <g transform="translate(0, 0)">
        <rect width="65" height="20" class="tag-bg" />
        <text x="12" y="14" class="tag-text">Python</text>
      </g>
      <!-- PyTorch -->
      <g transform="translate(71, 0)">
        <rect width="70" height="20" class="tag-bg" />
        <text x="12" y="14" class="tag-text">PyTorch</text>
      </g>
      <!-- Milvus -->
      <g transform="translate(147, 0)">
        <rect width="70" height="20" class="tag-bg" />
        <text x="12" y="14" class="tag-text">Milvus</text>
      </g>
      <!-- FastAPI -->
      <g transform="translate(223, 0)">
        <rect width="70" height="20" class="tag-bg" />
        <text x="12" y="14" class="tag-text">FastAPI</text>
      </g>
      <!-- Docker -->
      <g transform="translate(299, 0)">
        <rect width="65" height="20" class="tag-bg" />
        <text x="12" y="14" class="tag-text">Docker</text>
      </g>
    </g>
  </g>

  <!-- Graphic Illustration (Right Aligned) -->
  <g class="float-illustration" transform="translate(620, 85)">
    <!-- Face box mesh -->
    <rect x="-40" y="-40" width="80" height="80" rx="8" fill="none" stroke="#334155" stroke-dasharray="2 2" stroke-width="1.5" />
    
    <!-- Facial outline points -->
    <path d="M-20,-15 C-10,-25 10,-25 20,-15" fill="none" stroke="#f43f5e" stroke-width="1.5" opacity="0.6"/>
    <path d="M-15,15 C-5,25 5,25 15,15" fill="none" stroke="#f43f5e" stroke-width="1.5" opacity="0.6"/>
    
    <!-- Target scanning line -->
    <line x1="-45" y1="-10" x2="45" y2="-10" stroke="#f43f5e" stroke-width="1.5" class="glowing-node" />
    
    <!-- Scanning Corner brackets -->
    <path d="M-45,-30 L-45,-45 L-30,-45" fill="none" stroke="#f43f5e" stroke-width="2" />
    <path d="M45,-30 L45,-45 L30,-45" fill="none" stroke="#f43f5e" stroke-width="2" />
    <path d="M-45,30 L-45,45 L-30,45" fill="none" stroke="#f43f5e" stroke-width="2" />
    <path d="M45,30 L45,45 L30,45" fill="none" stroke="#f43f5e" stroke-width="2" />
    
    <!-- Core nodes -->
    <circle cx="0" cy="0" r="3" fill="#f43f5e" />
    <circle cx="-15" cy="-5" r="2.5" fill="#f43f5e" />
    <circle cx="15" cy="-5" r="2.5" fill="#f43f5e" />
    <circle cx="0" cy="18" r="2.5" fill="#f43f5e" />
  </g>

  <!-- Interactive CTA link indicator -->
  <g transform="translate(40, 155)">
    <text x="0" y="0" class="cta-text">EXPLORE REPOSITORY &amp; ARCHITECTURE →</text>
  </g>
</svg>
`;
};

// 3. Turfly Card
const renderTurfly = () => {
  const width = 800;
  const height = 175;
  
  return `
  ${getCommonHeader(width, height)}
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#card-grad)" class="card-bg" />
  <rect width="${width}" height="${height}" fill="url(#card-grid)" rx="16" />
  
  <!-- Glowing border line -->
  <path d="M 30 0 L 150 0" stroke="url(#turfly-glow)" stroke-width="2.5" stroke-linecap="round" />
  
  <!-- Content Group -->
  <g transform="translate(40, 30)">
    <!-- Status Badge -->
    <g transform="translate(0, 0)">
      <rect width="90" height="18" rx="4" fill="#0d2620" stroke="#065f46" stroke-width="0.75" />
      <circle cx="10" cy="9" r="2.5" fill="#10b981" />
      <text x="20" y="12" class="status-text" fill="#10b981">Deployment</text>
    </g>

    <!-- Title -->
    <text x="0" y="44" class="proj-title">Turfly</text>
    
    <!-- Description -->
    <text x="0" y="70" class="proj-desc">A sports facility booking and local player matchmaking social platform,</text>
    <text x="0" y="88" class="proj-desc">reducing scheduler friction and forming real-world athlete matches.</text>

    <!-- Tech Tags -->
    <g transform="translate(0, 106)">
      <!-- React Native -->
      <g transform="translate(0, 0)">
        <rect width="100" height="20" class="tag-bg" />
        <text x="12" y="14" class="tag-text">React Native</text>
      </g>
      <!-- Node.js -->
      <g transform="translate(106, 0)">
        <rect width="70" height="20" class="tag-bg" />
        <text x="12" y="14" class="tag-text">Node.js</text>
      </g>
      <!-- Express -->
      <g transform="translate(182, 0)">
        <rect width="70" height="20" class="tag-bg" />
        <text x="12" y="14" class="tag-text">Express</text>
      </g>
      <!-- MongoDB -->
      <g transform="translate(258, 0)">
        <rect width="75" height="20" class="tag-bg" />
        <text x="12" y="14" class="tag-text">MongoDB</text>
      </g>
    </g>
  </g>

  <!-- Graphic Illustration (Right Aligned) -->
  <g class="float-illustration" transform="translate(620, 85)">
    <!-- Sports pitch outline (isometric) -->
    <polygon points="0,-35 50,-10 0,15 -50,-10" fill="none" stroke="#10b981" stroke-width="1.5" />
    <line x1="-25" y1="-22" x2="25" y2="2" stroke="#10b981" stroke-width="1" opacity="0.6" />
    
    <!-- Outer boundary dots -->
    <circle cx="0" cy="-35" r="2.5" fill="#10b981" />
    <circle cx="50" cy="-10" r="2.5" fill="#10b981" />
    <circle cx="0" cy="15" r="2.5" fill="#10b981" />
    <circle cx="-50" cy="-10" r="2.5" fill="#10b981" />
    
    <!-- Player Connection Nodes -->
    <circle cx="-15" cy="-5" r="10" fill="#06b6d4" fill-opacity="0.1" class="glowing-node" />
    <circle cx="-15" cy="-5" r="3.5" fill="#06b6d4" />
    
    <circle cx="15" cy="-15" r="10" fill="#10b981" fill-opacity="0.1" class="glowing-node" style="animation-delay:-1s;" />
    <circle cx="15" cy="-15" r="3.5" fill="#10b981" />
    
    <!-- Connection path (matchmaking) -->
    <path d="M-15,-5 C0,-10 0,-10 15,-15" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3 3" class="dash-flow" />
  </g>

  <!-- Interactive CTA link indicator -->
  <g transform="translate(40, 155)">
    <text x="0" y="0" class="cta-text">EXPLORE REPOSITORY &amp; ROADMAP →</text>
  </g>
</svg>
`;
};

// Write files
fs.writeFileSync(path.join(targetDir, 'mindmirror_card.svg'), renderMindMirror().trim());
fs.writeFileSync(path.join(targetDir, 'crimeface_card.svg'), renderCrimeFace().trim());
fs.writeFileSync(path.join(targetDir, 'turfly_card.svg'), renderTurfly().trim());

console.log('Successfully generated 3 project card SVGs in assets/svg/project_cards/');
