const fs = require('fs');
const path = require('path');

// Load config
const settingsPath = path.join(__dirname, '..', 'config', 'settings.json');
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
const timelineData = settings.learning_journey;

const targetDir = path.join(__dirname, '..', 'assets', 'svg');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const SVG_WIDTH = 800;
const SVG_HEIGHT = 160;
const START_X = 50;
const END_X = 750;
const AXIS_Y = 80; // Center axis vertically

let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" width="100%" height="100%">
  <defs>
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&amp;family=Inter:wght@400;500&amp;display=swap');
      
      .axis-line {
        stroke: #1e293b;
        stroke-width: 3;
        stroke-linecap: round;
      }
      .axis-active {
        stroke: url(#active-grad);
        stroke-width: 3;
        stroke-linecap: round;
        stroke-dasharray: 8, 12;
        animation: dashMove 30s linear infinite;
      }
      @keyframes dashMove {
        0% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: -1000; }
      }
      
      .milestone-title {
        font-family: 'Outfit', system-ui, sans-serif;
        font-size: 11.5px;
        font-weight: 700;
        fill: #f8fafc;
      }
      
      .milestone-detail {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 9.5px;
        fill: #64748b;
        font-weight: 400;
      }
      
      .node-core {
        fill: #030712;
        stroke-width: 2.5;
      }
      .node-pulse {
        animation: pulseNode 3s ease-in-out infinite alternate;
      }
      @keyframes pulseNode {
        0% { r: 6; fill-opacity: 0.15; }
        100% { r: 12; fill-opacity: 0.4; }
      }
    </style>

    <linearGradient id="active-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>

    <linearGradient id="glow-node-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
  </defs>

  <!-- Background container -->
  <rect width="100%" height="100%" fill="#030712" rx="16" stroke="#1e293b" stroke-width="1.5" />
  
  <!-- Subtle Grid Overlay -->
  <g opacity="0.1">
    <path d="M 0,40 L 800,40 M 0,80 L 800,80 M 0,120 L 800,120" stroke="#1e293b" stroke-width="0.5" />
    <path d="M 100,0 L 100,160 M 200,0 L 200,160 M 300,0 L 300,160 M 400,0 L 400,160 M 500,0 L 500,160 M 600,0 L 600,160 M 700,0 L 700,160" stroke="#1e293b" stroke-width="0.5" />
  </g>

  <!-- Base Timeline Axis Line -->
  <line x1="${START_X}" y1="${AXIS_Y}" x2="${END_X}" y2="${AXIS_Y}" class="axis-line" />
  <line x1="${START_X}" y1="${AXIS_Y}" x2="${END_X}" y2="${AXIS_Y}" class="axis-active" />
`;

const nodeCount = timelineData.length;
const segmentWidth = (END_X - START_X) / (nodeCount - 1);

timelineData.forEach((node, index) => {
  const x = START_X + index * segmentWidth;
  const isOdd = index % 2 !== 0; // Odd indices go below, even go above (0-indexed)
  
  // Custom glowing indicators based on timeline completion (newer items glow cyan/blue)
  const glowColor = index >= nodeCount - 3 ? "#38bdf8" : (index >= nodeCount - 5 ? "#3b82f6" : "#6366f1");
  const delay = (index * 0.4).toFixed(1);
  
  // Layout nodes
  svgContent += `
  <!-- NODE ${index + 1}: ${node.milestone} -->
  <g>
    <!-- Node Connection line up/down -->
    <line x1="${x}" y1="${AXIS_Y}" x2="${x}" y2="${isOdd ? AXIS_Y + 15 : AXIS_Y - 15}" stroke="#1e293b" stroke-width="1.5" />
    
    <!-- Outer Pulse Circle -->
    <circle cx="${x}" cy="${AXIS_Y}" r="7" fill="${glowColor}" fill-opacity="0.2" class="node-pulse" style="animation-delay: -${delay}s;" />
    
    <!-- Core Circle -->
    <circle cx="${x}" cy="${AXIS_Y}" r="5" class="node-core" stroke="${glowColor}" />
    
    <!-- Labels -->
  `;
  
  if (isOdd) {
    // Labels placed below the axis
    svgContent += `
    <text x="${x}" y="${AXIS_Y + 34}" class="milestone-title" text-anchor="middle">${node.milestone}</text>
    <text x="${x}" y="${AXIS_Y + 48}" class="milestone-detail" text-anchor="middle">${node.detail}</text>
    `;
  } else {
    // Labels placed above the axis
    svgContent += `
    <text x="${x}" y="${AXIS_Y - 34}" class="milestone-title" text-anchor="middle">${node.milestone}</text>
    <text x="${x}" y="${AXIS_Y - 22}" class="milestone-detail" text-anchor="middle">${node.detail}</text>
    `;
  }
  
  svgContent += `
  </g>
  `;
});

svgContent += `\n</svg>`;

fs.writeFileSync(path.join(targetDir, 'learning_journey.svg'), svgContent);
console.log('Successfully generated assets/svg/learning_journey.svg');
