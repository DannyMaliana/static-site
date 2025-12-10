const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');
const frontMatter = require('front-matter');

// Configuration
const config = {
  srcPath: path.join(__dirname, 'src'),
  distPath: path.join(__dirname, 'public'),
  contentPath: path.join(__dirname, 'src', 'content'),
  templatePath: path.join(__dirname, 'src', 'templates', 'layout.html'),
};

// Ensure output dir exists and is empty
fs.emptyDirSync(config.distPath);

// Copy assets (CSS, images, etc.)
// We only have CSS for now, but let's copy the whole css dir
fs.copySync(path.join(config.srcPath, 'css'), path.join(config.distPath, 'css'));
console.log('Copied CSS assets.');

// Copy static index.html if it exists
if (fs.existsSync(path.join(config.srcPath, 'index.html'))) {
  fs.copySync(path.join(config.srcPath, 'index.html'), path.join(config.distPath, 'index.html'));
  console.log('Copied static index.html');
}

// Read Templates
const layoutTemplate = fs.readFileSync(config.templatePath, 'utf-8');
const blogPostTemplate = fs.readFileSync(path.join(__dirname, 'src', 'templates', 'blog-post.html'), 'utf-8');

// Helper function to process files recursively
function processDirectory(directory) {
  const items = fs.readdirSync(directory);

  items.forEach(item => {
    const itemPath = path.join(directory, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      processDirectory(itemPath);
    } else if (path.extname(item) === '.md') {
      buildPage(itemPath);
    }
  });
}

// Scan for blog posts first to generate the list
const blogPosts = [];
const blogDir = path.join(config.contentPath, 'blog');

if (fs.existsSync(blogDir)) {
  const files = fs.readdirSync(blogDir);
  files.forEach(file => {
    if (path.extname(file) === '.md' && file !== 'index.md') {
      const filePath = path.join(blogDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { attributes } = frontMatter(fileContent);
      blogPosts.push({
        ...attributes,
        url: `/blog/${file.replace('.md', '.html')}`,
        dateObj: attributes.date ? new Date(attributes.date) : new Date(0)
      });
    }
  });
}

// Sort by date descending
blogPosts.sort((a, b) => b.dateObj - a.dateObj);

// Generate HTML for blog list
const blogListHtml = `
<div class="blog-list">
  ${blogPosts.map(post => `
  <div class="card">
    <a href="${post.url}">
      <h3>${post.title}</h3>
      <span class="meta">${post.dateObj.toISOString().split('T')[0]}</span>
      <p>${post.description || ''}</p>
    </a>
  </div>
  `).join('')}
</div>
`;

// Start Build
console.log('Starting build...');
processDirectory(config.contentPath);
console.log('Build complete!');

function buildPage(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { attributes, body } = frontMatter(fileContent);
  let htmlContent = marked.parse(body);

  // Inject dynamic blog list if placeholder exists (specifically for blog index)
  if (filePath.includes(path.join('src', 'content', 'blog', 'index.md'))) {
    htmlContent = htmlContent.replace('{{ blog_list }}', blogListHtml);
  }

  // Select Template
  // Check if file is in src/content/blog/ AND is not index.md
  const isBlogPost = filePath.includes(path.join('src', 'content', 'blog')) && path.basename(filePath) !== 'index.md';
  const templateToUse = isBlogPost ? blogPostTemplate : layoutTemplate;

  if (isBlogPost) {
    console.log(`Building Blog Post: ${filePath}`);
  }

  // Simple Template Engine
  let pageHtml = templateToUse
    .replace(/\{\{\s*title\s*\}\}/g, attributes.title || 'My Website')
    .replace(/\{\{\s*description\s*\}\}/g, attributes.description || '')
    .replace(/\{\{\s*date\s*\}\}/g, attributes.date instanceof Date ? attributes.date.toISOString().split('T')[0] : (attributes.date || ''))
    .replace(/\{\{\s*content\s*\}\}/g, htmlContent);

  // Determine output path
  // Relativize path from src/content to match in public/
  const relativePath = path.relative(config.contentPath, filePath);
  // Change extension from .md to .html
  const outputRelativePath = relativePath.replace(/\.md$/, '.html');
  const outputPath = path.join(config.distPath, outputRelativePath);

  // Ensure subdirectory exists
  fs.ensureDirSync(path.dirname(outputPath));

  // Write file
  fs.writeFileSync(outputPath, pageHtml);
  console.log(`Generated: ${outputRelativePath}`);
}
