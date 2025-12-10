# Simple Static Site Generator

A lightweight, no-framework static site generator built with Node.js.

## Live Demo
[View Live Site](https://DannyMaliana.github.io/static-site)

## Features
- **Markdown-based Content**: Write your pages and blog posts in Markdown.
- **Custom Build Script**: No heavy frameworks, just a simple Node.js script (`build.js`).
- **Templating**: Simple HTML templates for consistent layout.
- **Blog Support**: Automatic blog post listing and dedicated blog post templates.
- **Premium Design**: Dark-themed, responsive CSS with Inter font.

## Project Structure
```
/
├── package.json
├── build.js          # Static site generator script
├── src/
│   ├── content/      # Markdown files (pages & blog posts)
│   ├── templates/    # HTML templates (layout.html, blog-post.html)
│   ├── css/          # Styles
│   └── index.html    # Static landing page
└── public/           # Generated output (Gitignored)
```

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Build the Site**
    ```bash
    npm run build
    ```

3.  **Preview Locally**
    ```bash
    npx serve public
    ```

4.  **Deploy to GitHub Pages**
    ```bash
    npm run deploy
    ```

## Adding Content
- **Pages**: Add `.md` files to `src/content/` (e.g., `services.md`).
- **Blog Posts**: Add `.md` files to `src/content/blog/`. Front matter must include `date`.