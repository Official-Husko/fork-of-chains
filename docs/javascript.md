# ⚡ Compiling Javascript Files

![Version: 1.0](https://img.shields.io/badge/Version-1.0-green) ![Last  Updated: 2025-06-27](https://img.shields.io/badge/Last%20Updated-27--06--2025-blue)

This document explains how to compile the JavaScript and CSS files used in the game. It covers both full builds that include all assets, as well as compiling only the `.twee` files.

## 🏗️ Build Overview

During a full build of the project, two steps are run:

1️⃣ **Compile all `.js` (JavaScript) and `.css` (style) files** into a pair of bundle files:
   - `generated/dist/user.min.js`
   - `generated/dist/user.min.css`

2️⃣ **Compile the `.twee` files** together with the JS/CSS bundle (using Tweego) into the final `dist/index.html`.

---

## 🛠️ Full Build (JS/CSS & Twee)

First, make sure you have a recent version of [NodeJS](https://nodejs.org/en) installed to run `node` and `npm` commands.

Open a terminal in the root directory of the repository (where `package.json` is located) and run:

```bash
npm install
```

Then, to build everything:

```bash
npm run build
```

This will compile both JS+CSS and Twee files, generating the final `dist/index.html` file, which you can open in your browser to play the game.

> [!WARNING]
> The above command creates a debug build. See below for other build options.

### 🔧 Build Modes

- **Debug build:**
  ```bash
  npm run build
  ```
- **Production build:**
  (see your project's scripts for additional options)

Intermediate JS+CSS bundles are generated in different folders depending on the mode:
- Production: `generated/dist/user.min.js` and `generated/dist/user.min.css`
- Debug: `generated/debug/user.min.js` and `generated/debug/user.min.css`

---

## 📝 Compile Only Twee

If you only want to compile the `.twee` files, you don't need NodeJS. Run one of these from the root directory:

- **Linux/macOS:**
  ```bash
  ./compile.sh
  ```
- **Windows:**
  ```bat
  ./compile.bat
  ```

To use the debug bundle:

```bash
./compile.sh debug
```

---

## ⚙️ Devmode (Experimental)

You can run an interactive development server with hot reload:

```bash
npx vite dev
```

Once ready, open [http://localhost:3100](http://localhost:3100) in your browser.

- Changes to JS and CSS files will trigger hot reload.
- Some UI changes may update instantly without a full page reload.
- Some features may not work perfectly yet, but it's very useful for UI testing.

---

## 🚀 Version Bump, Precompiling, and Deploying

See the [Deployment Guide](docs/deploy.md) for more info.
