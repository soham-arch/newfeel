# Profile System Architecture

This repository operates as a dynamic, automated developer portfolio system. It is designed to render a premium SaaS-like landing page on Soham Patil's GitHub profile while remaining lightweight and fully compliant with GitHub's strict Markdown sanitization filters.

---

## Folder Structure

```
├── .github/
│   └── workflows/
│       └── profile-updater.yml      # DevOps automation (cron/push)
├── assets/
│   └── svg/
│       ├── section_dividers/        # Organic wavy/slope page transitions
│       ├── project_cards/           # Custom SaaS project layouts
│       ├── stats/                   # Dynamic SVGs (compiled via actions)
│       ├── hero_banner.svg          # Typing subtitle & floating network node
│       ├── about_illustration.svg   # stacked full-stack block visual
│       └── tech_stack.svg           # Tech categories tag dashboard
├── config/
│   └── settings.json                # Single source of truth config file
├── scripts/
│   ├── generate_dividers.js         # Creates section wave paths
│   ├── generate_tech_stack_svg.js   # Dynamic tag-wrapping tag cloud builder
│   ├── generate_project_cards_svg.js# Builds custom product visual SVGs
│   ├── generate_stats_svg.js        # Live Github API stats SVG compiler
│   └── update_readme.js             # Combines template & injects dynamic content
├── templates/
│   └── README.template.md           # Visual markdown blueprint with comment slots
└── README.md                        # Final compiled landing page README
```

---

## How It Works

### 1. Configuration-First Design (`settings.json`)
All details—bio, socials, projects, skills, timeline, and roadmap—are stored in `config/settings.json`. Modifying this file propagates updates throughout the entire system.

### 2. Modular SVG Compilers
Instead of heavy static images or third-party badge links (which slow down page loading or break due to API outages), custom NodeJS scripts generate and save SVGs locally:
- **`generate_tech_stack_svg.js`**: Computes pill dimensions based on text length and dynamically wraps them in a 3-column grid.
- **`generate_stats_svg.js`**: Queries the GitHub GraphQL API (authenticated) for stars, commits, PRs, issues, and language distribution, and compiles three statistics dashboard SVGs.
- **`generate_project_cards_svg.js`**: Creates visually distinct isometric illustrations, tags, and status labels for featured products.

### 3. README Compilation (`update_readme.js`)
This script reads the raw template, fetches the user's latest 4 active repositories, formats them as modular responsive cards, updates the last build date, and compiles the final `README.md`.

### 4. Continuous Integration (`profile-updater.yml`)
Every 12 hours (or on pushes to main), the GitHub Actions workflow checks out the repository, setups Node, regenerates the stats SVGs, runs the contribution grid snake compiler, runs the README compiler, and pushes changes back.

---

## Development & Local Compilation

To rebuild the assets and compile the README locally, run:

```bash
# 1. Generate core static SVGs
node scripts/generate_dividers.js
node scripts/generate_tech_stack_svg.js
node scripts/generate_project_cards_svg.js

# 2. Compile stats SVGs (uses mock stats locally if GITHUB_TOKEN is omitted)
node scripts/generate_stats_svg.js

# 3. Fetch active repos and compile final README
node scripts/update_readme.js
```
