# Systemizer

A Figma plugin that automatically generates text style guides from your designs. Built for lazy designers who want to quickly document their typography system.

## What it does

Systemizer scans your Figma page for text nodes, identifies unique font sizes, and creates a visual style guide showing all your text styles in one organized frame.

## How to use

1. Open the plugin in your Figma file
2. Click "Generate Text Library"
3. Review and edit the variation names (e.g., "Heading 1", "Body Text")
4. Click "Generate" to create your style guide frame

The plugin will create an auto-layout frame with all your text styles sorted by size (largest to smallest).

## Features

- **Automatic detection**: Finds all unique text styles on your current page
- **Smart filtering**: Ignores text nodes with mixed font properties
- **Editable names**: Customize style names before generating
- **Organized output**: Creates a clean, auto-layout frame with proper spacing

## Development

### Prerequisites

- Node.js and npm
- Figma desktop app

### Setup

```bash
npm install
```

### Run development mode

```bash
npm run dev
```

This starts TypeScript compilation, build watching, and the Vite dev server.

### Build for production

```bash
npm run build
```

Outputs to `dist/` directory.

### Other commands

```bash
npm run tsc        # Type check
npm run format     # Format code with Prettier
npm test           # Run type check + build
```

## Project structure

```
plugin-src/        # Plugin code (runs in Figma's sandbox)
  code.ts          # Main plugin logic
ui-src/            # UI code (React app)
  App.tsx          # Main UI component
  main.tsx         # React entry point
  index.html       # HTML template
dist/              # Build output
  code.js          # Compiled plugin
  index.html       # Compiled UI
```

## How it works

Systemizer uses Figma's two-process plugin architecture:

1. **Plugin process** scans the document and manipulates nodes
2. **UI process** displays the interface and handles user input
3. Both communicate via message passing

When you generate a style guide, the plugin:
- Finds all text nodes using `findAllWithCriteria()`
- Filters out duplicates and mixed styles
- Sorts by font size (descending)
- Creates an auto-layout frame with text samples

## License

MIT

## Author

Desmond Sofua
