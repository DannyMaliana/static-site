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

// Read Layout Template
const layoutTemplate = fs.readFileSync(config.templatePath, 'utf-8');

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

function buildPage(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { attributes, body } = frontMatter(fileContent);
  const htmlContent = marked.parse(body);

  // Simple Template Engine
  let pageHtml = layoutTemplate
    .replace('{{ title }}', attributes.title || 'My Website')
    .replace('{{ description }}', attributes.description || '')
    .replace('{{ content }}', htmlContent);

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

// Start Build
console.log('Starting build...');
processDirectory(config.contentPath);
console.log('Build complete!');
