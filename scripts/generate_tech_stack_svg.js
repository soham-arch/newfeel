const fs = require('fs');
const path = require('path');

// Load config
const settingsPath = path.join(__dirname, '..', 'config', 'settings.json');
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
const techStack = settings.tech_stack;

const targetDir = path.join(__dirname, '..', 'assets', 'svg');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Design system constants
const SVG_WIDTH = 800;
const COLUMNS = 3;
const SPACING = 15;
const MARGIN = 10;
const CARD_WIDTH = (SVG_WIDTH - (MARGIN * 2) - (SPACING * (COLUMNS - 1))) / COLUMNS; // (800 - 20 - 30) / 3 = 250px
const CARD_HEIGHT = 185;
const ROW_SPACING = 15;

const categories = Object.keys(techStack); // e.g., ["Languages", "Frontend", "Backend", "Databases", "Artificial Intelligence", "Developer Tools"]
const totalRows = Math.ceil(categories.length / COLUMNS);
const SVG_HEIGHT = (totalRows * CARD_HEIGHT) + ((totalRows - 1) * ROW_SPACING) + (MARGIN * 2);

// Map categories to glowing indicator colors
const indicatorColors = {
  "Languages": "#38bdf8", // Cyan
  "Frontend": "#3b82f6", // Blue
  "Backend": "#6366f1", // Indigo
  "Databases": "#10b981", // Emerald
  "Artificial Intelligence": "#8b5cf6", // Purple
  "Developer Tools": "#f59e0b" // Amber
};

let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" width="100%" height="100%">
  <defs>
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&amp;family=Inter:wght@400;500&amp;display=swap');
      
      .card-bg {
        fill: #030712;
        stroke: #1e293b;
        stroke-width: 1.5;
        rx: 12px;
      }
      .card-header {
        font-family: 'Outfit', system-ui, sans-serif;
        font-size: 14px;
        font-weight: 700;
        fill: #f8fafc;
        letter-spacing: 0.02em;
      }
      .pill-bg {
        fill: #0d1527;
        stroke: #1e293b;
        stroke-width: 1;
        rx: 6px;
      }
      .pill-text {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 11px;
        font-weight: 500;
        fill: #94a3b8;
      }
      .grid-pattern {
        fill: none;
        stroke: #1e293b;
        stroke-width: 0.5;
        stroke-opacity: 0.15;
      }
    </style>
    
    <pattern id="card-grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" class="grid-pattern" />
    </pattern>
  </defs>

  <!-- Global background shadow blur -->
  <rect width="100%" height="100%" fill="none" />
`;

// Render each category card
categories.forEach((category, index) => {
  const col = index % COLUMNS;
  const row = Math.floor(index / COLUMNS);
  
  const x = MARGIN + col * (CARD_WIDTH + SPACING);
  const y = MARGIN + row * (CARD_HEIGHT + ROW_SPACING);
  
  const dotColor = indicatorColors[category] || "#3b82f6";
  
  svgContent += `
  <!-- CARD: ${category} -->
  <g transform="translate(${x}, ${y})">
    <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" class="card-bg" />
    <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#card-grid)" rx="12" />
    
    <!-- Glow Indicator line at top -->
    <path d="M 20 0 L ${CARD_WIDTH - 20} 0" stroke="${dotColor}" stroke-width="2" stroke-linecap="round" opacity="0.8" />
    
    <!-- Category Dot & Title -->
    <circle cx="20" cy="30" r="4" fill="${dotColor}" />
    <text x="32" y="34" class="card-header">${category}</text>
    
    <!-- Tech Stack Pills Grid -->
    <g transform="translate(15, 55)">
  `;
  
  const items = techStack[category];
  let currentX = 0;
  let currentY = 0;
  const cardContentWidth = CARD_WIDTH - 30; // 250 - 30 = 220px limit
  
  items.forEach((item) => {
    // Estimate pill width: padding-left (8) + dot space (12) + text width (approx 6.5px per char) + padding-right (8)
    const charWidth = 6.2;
    const textWidth = Math.ceil(item.length * charWidth);
    const pillWidth = 8 + 10 + textWidth + 8;
    const pillHeight = 24;
    
    // Wrap to next line if it exceeds card content bounds
    if (currentX + pillWidth > cardContentWidth) {
      currentX = 0;
      currentY += pillHeight + 8; // Move down 32px
    }
    
    // Render individual pill
    svgContent += `
      <g transform="translate(${currentX}, ${currentY})">
        <rect width="${pillWidth}" height="${pillHeight}" class="pill-bg" />
        <circle cx="10" cy="12" r="2.5" fill="${dotColor}" opacity="0.7" />
        <text x="18" y="15" class="pill-text">${item}</text>
      </g>
    `;
    
    currentX += pillWidth + 6; // Move right with 6px gap
  });
  
  svgContent += `
    </g>
  </g>
  `;
});

svgContent += `\n</svg>`;

fs.writeFileSync(path.join(targetDir, 'tech_stack.svg'), svgContent);
console.log('Successfully generated assets/svg/tech_stack.svg');
