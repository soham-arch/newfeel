const fs = require('fs');
const path = require('path');
const https = require('https');

// Paths
const rootDir = path.join(__dirname, '..');
const settingsPath = path.join(rootDir, 'config', 'settings.json');
const templatePath = path.join(rootDir, 'templates', 'README.template.md');
const outputPath = path.join(rootDir, 'README.md');

// Load settings
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
const username = settings.github_username;
const token = process.env.GITHUB_TOKEN;

// Default repositories to display if API fails
const fallbackRepos = settings.projects.map(p => ({
  name: p.name,
  html_url: p.github_link,
  description: p.description,
  stargazers_count: 3,
  forks_count: 0,
  language: p.tech[0]
}));

// Helper to make HTTPS requests
function fetchLatestRepos(username, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/users/${username}/repos?sort=updated&direction=desc&per_page=5`,
      method: 'GET',
      headers: {
        'User-Agent': 'soham-arch-portfolio-updater'
      }
    };

    if (token) {
      options.headers['Authorization'] = `token ${token}`;
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`GitHub REST API responded with status ${res.statusCode}`));
        }
        try {
          const repos = JSON.parse(body);
          if (Array.isArray(repos)) {
            // Filter out user profile README repository itself
            const filtered = repos.filter(repo => repo.name.toLowerCase() !== username.toLowerCase());
            resolve(filtered.slice(0, 4));
          } else {
            reject(new Error('Invalid response format from GitHub API'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

// Format repos into clean markdown grid card system
function formatReposMarkdown(repos) {
  let markdown = '<table width="100%" border="0" cellpadding="8" cellspacing="0">\n';
  
  for (let i = 0; i < repos.length; i += 2) {
    markdown += '  <tr style="border: none;">\n';
    
    // Left card
    const repoL = repos[i];
    markdown += `    <td width="50%" valign="top" style="border: none; padding-bottom: 15px;">
      <div style="background-color: #030712; border: 1.5px solid #1e293b; border-radius: 12px; padding: 15px; min-height: 110px;">
        <h4 style="margin: 0 0 8px 0; font-family: 'Outfit', sans-serif;">
          <a href="${repoL.html_url}" target="_blank" style="color: #38bdf8; text-decoration: none; font-weight: 700;">📂 ${repoL.name}</a>
        </h4>
        <p style="margin: 0 0 12px 0; font-size: 12px; color: #94a3b8; line-height: 1.4; font-family: 'Inter', sans-serif;">
          ${repoL.description || 'No description provided.'}
        </p>
        <div style="font-size: 11px; color: #64748b; font-family: 'JetBrains Mono', monospace;">
          <span style="margin-right: 15px;">⭐ ${repoL.stargazers_count || 0}</span>
          <span style="margin-right: 15px;">🍴 ${repoL.forks_count || 0}</span>
          <span style="color: #3b82f6;">●</span> ${repoL.language || 'Code'}
        </div>
      </div>
    </td>\n`;
    
    // Right card (or empty cell if odd number of repos)
    const repoR = repos[i + 1];
    if (repoR) {
      markdown += `    <td width="50%" valign="top" style="border: none; padding-bottom: 15px;">
      <div style="background-color: #030712; border: 1.5px solid #1e293b; border-radius: 12px; padding: 15px; min-height: 110px;">
        <h4 style="margin: 0 0 8px 0; font-family: 'Outfit', sans-serif;">
          <a href="${repoR.html_url}" target="_blank" style="color: #38bdf8; text-decoration: none; font-weight: 700;">📂 ${repoR.name}</a>
        </h4>
        <p style="margin: 0 0 12px 0; font-size: 12px; color: #94a3b8; line-height: 1.4; font-family: 'Inter', sans-serif;">
          ${repoR.description || 'No description provided.'}
        </p>
        <div style="font-size: 11px; color: #64748b; font-family: 'JetBrains Mono', monospace;">
          <span style="margin-right: 15px;">⭐ ${repoR.stargazers_count || 0}</span>
          <span style="margin-right: 15px;">🍴 ${repoR.forks_count || 0}</span>
          <span style="color: #3b82f6;">●</span> ${repoR.language || 'Code'}
        </div>
      </div>
    </td>\n`;
    } else {
      markdown += '    <td width="50%" style="border: none;"></td>\n';
    }
    
    markdown += '  </tr>\n';
  }
  
  markdown += '</table>';
  return markdown;
}

async function main() {
  console.log('Compiling README.md from template...');
  
  let repos = fallbackRepos;
  try {
    console.log(`Fetching active repositories for ${username}...`);
    const fetched = await fetchLatestRepos(username, token);
    if (fetched && fetched.length > 0) {
      repos = fetched;
      console.log(`Successfully fetched ${repos.length} active repositories.`);
    }
  } catch (err) {
    console.warn('Could not fetch active repositories, using project details as fallback:', err.message);
  }

  // Format the repositories markdown
  const reposMarkdown = formatReposMarkdown(repos);
  
  // Read template
  let template = fs.readFileSync(templatePath, 'utf8');
  
  // Replace LATEST_REPOS section
  const startRepoMarker = '<!-- START_SECTION:latest_repos -->';
  const endRepoMarker = '<!-- END_SECTION:latest_repos -->';
  const startIndex = template.indexOf(startRepoMarker);
  const endIndex = template.indexOf(endRepoMarker);
  
  if (startIndex !== -1 && endIndex !== -1) {
    const before = template.substring(0, startIndex + startRepoMarker.length);
    const after = template.substring(endIndex);
    template = before + '\n' + reposMarkdown + '\n' + after;
  }
  
  // Replace BUILD_DATE section
  const startDateMarker = '<!-- START_SECTION:update_date -->';
  const endDateMarker = '<!-- END_SECTION:update_date -->';
  const startIndexDate = template.indexOf(startDateMarker);
  const endIndexDate = template.indexOf(endDateMarker);
  
  if (startIndexDate !== -1 && endIndexDate !== -1) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const before = template.substring(0, startIndexDate + startDateMarker.length);
    const after = template.substring(endIndexDate);
    template = before + today + after;
  }
  
  // Write final README.md
  fs.writeFileSync(outputPath, template);
  console.log('README.md compiled successfully!');
}

main().catch(console.error);
