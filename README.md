# Simple Static Site Generator

A lightweight, custom static site generator built with Node.js. It converts Markdown files into a clear, premium-designed HTML website.

## Features
- **Markdown Support**: Write your content in simple Markdown.
- **Modern Design**: Clean, responsive aesthetic using CSS variables and Inter font.
- **Zero Config**: Just run the build script.
- **No Heavy Frameworks**: Pure Node.js logic.

## Project Structure
```
/
├── build.js          # The generator script
├── src/
│   ├── content/      # Your Markdown pages
│   ├── css/          # Styles
│   └── templates/    # HTML Layout
└── public/           # Generated site (do not edit manually)
```

## How to Use

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Build**
   ```bash
   node build.js
   ```

3. **Preview**
   You can use any static file server to preview the `public` folder.
   ```bash
   npx serve public
   ```

## Adding Content
- Create new `.md` files in `src/content`.
- Add front matter at the top:
  ```yaml
  ---
  title: My Page Title
  description: Page description
  ---
  ```
- Subdirectories in `src/content` (like `blog/`) remain as subdirectories in the output.