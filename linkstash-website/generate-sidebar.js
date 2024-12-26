const fs = require('fs');
const path = require('path');

// Function to extract the first header from a markdown file
function getFirstHeader(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^# (.+)/m); // Match the first header (H1)
  return match ? match[1].trim() : null;
}

// Function to check if a folder contains .md files and handle README.md
function getFolderLink(dir) {
  const items = fs.readdirSync(dir);
  const readmePath = items.find(item => item.toLowerCase() === 'readme.md');

  if (readmePath) {
    const fullPath = path.join(dir, readmePath);
    const header = getFirstHeader(fullPath);
    const linkText = header || path.basename(dir); // Use header or fallback to folder name
    const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/'); // Adjust for Windows paths
    return { linkText, relativePath };
  }

  // Check if the folder has any other .md files
  const hasMdFiles = items.some(item => item.endsWith('.md') && item !== '_sidebar.md');
  return hasMdFiles ? { linkText: path.basename(dir), relativePath: null } : null;
}

// Function to generate the sidebar dynamically
function generateSidebar(dir, depth = 0) {
  const items = fs.readdirSync(dir).filter(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      return !!getFolderLink(fullPath); // Include folders with valid README.md or .md files
    }
    return file.endsWith('.md') && file !== '_sidebar.md' && file !== 'README.md'; // Include only valid .md files
  });

  // Map items to an array with titles for sorting
  const entries = items.map(item => {
    const fullPath = path.join(dir, item);
    if (fs.lstatSync(fullPath).isDirectory()) {
      const folderLink = getFolderLink(fullPath);
      if (folderLink) {
        return { type: 'folder', title: folderLink.linkText, path: fullPath, link: folderLink.relativePath };
      }
    } else {
      const header = getFirstHeader(fullPath);
      const title = header || path.parse(item).name; // Use header or fallback to file name
      const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/'); // Adjust for Windows paths
      return { type: 'file', title, path: fullPath, link: relativePath };
    }
    return null;
  }).filter(entry => entry !== null);

  // Sort entries by title
  entries.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));

  let sidebarContent = '';

  // Build sidebar content
  entries.forEach(entry => {
    if (entry.type === 'folder') {
      if (entry.link) {
        // Link folder to its README.md file
        sidebarContent += `${'  '.repeat(depth)}- [${entry.title}](${entry.link})\n`;
      } else {
        // List folder name without link
        sidebarContent += `${'  '.repeat(depth)}- ${entry.title}\n`;
      }
      sidebarContent += generateSidebar(entry.path, depth + 1); // Recurse into folder
    } else if (entry.type === 'file') {
      sidebarContent += `${'  '.repeat(depth)}- [${entry.title}](${entry.link})\n`;
    }
  });

  return sidebarContent;
}

// Get the root path from the command-line arguments or use './' as default
const rootDir = process.argv[2] || './';

// Ensure the directory exists
if (!fs.existsSync(rootDir)) {
  console.error(`Error: The directory "${rootDir}" does not exist.`);
  process.exit(1);
}

// Generate and write the sidebar
const sidebar = generateSidebar(rootDir); // Use the provided directory
const sidebarPath = path.join(rootDir, '_sidebar.md');
fs.writeFileSync(sidebarPath, sidebar);

console.log(`Sidebar generated successfully at ${sidebarPath}`);
