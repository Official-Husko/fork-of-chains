# 🚀 Test / Deployment Guide

![Version: 1.0](https://img.shields.io/badge/Version-1.0-green) ![Last  Updated: 2025-06-27](https://img.shields.io/badge/Last%20Updated-27--06--2025-blue)

This guide details the deployment process for the game **Fort of Chains: Galvanized**.

To deploy, you must first [install NodeJS](docs/javascript.md).

The deployment process consists of several steps:

- ✅ Test
- 🔢 Increase version number
- 🏗️ Build the precompiled version
- 📦 Optionally, build the zip version to upload on itch.io

---

## ✅ Test

The game has a semi-automated testing system:

1. [Compile the game](docs/javascript.md)
2. Open the game, then from the main menu, select `(Debug start)`
3. Go to `Settings`
4. Scroll down and select `(TEST EVERYTHING)`
5. Wait for a few minutes until the testing is completed
6. Open the Javascript Console (e.g., `Ctrl + Shift + J`), and look for errors there
7. If you find an error, search the page for `error` to locate the problematic quest/content

This test will try and run all quests, opportunities, events, interactions, epilogues, activities, and more. If the test succeeds, the game is likely in a good state.

If you have `npm` installed, you can also run a sanity check for common mistakes:

```bash
npm run sanity
```

---

## 🔢 Increasing Version Number

> [!WARNING]
> The following commands for increasing the version number will soon be replaced with a Go-based equivalent.

- **Linux:**
  - Micro version: `npm run set-version bump` (e.g., 1.8.2.3 → 1.8.2.4)
  - Patch version: `npm run set-version bump-patch` (e.g., 1.8.2.3 → 1.8.3.0)
  - Minor version: `npm run set-version bump-minor` (e.g., 1.8.2.3 → 1.9.0.0)
  - Major version: `npm run set-version bump-major` (e.g., 1.8.2.3 → 2.0.0.0)
- **Windows:**
  - Micro: `update.bat`
  - Patch: `updatepatch.bat`
  - Minor: `updateminor.bat`
  - Major: `updatemajor.bat`

The command above will automatically update `changelog.txt`. Please update this file with your changes.

---

## 🏗️ Building the Precompiled Version

- **Linux:**
  ```bash
  npm run precompile
  ```
- **Windows:**
  Run `precompile.bat`

This will update the `dist` folder with the latest precompiled version.

---

## 📦 Building the Full Zip Version

> [!NOTE]
> This may take a while.

- **Linux:**
  ```bash
  npm run deployfull
  ```
- **Windows:**
  Run `deployfull.bat`

This will generate a `focfull.zip` containing the full game with all images.

---

## 📝 Release Notes and Documentation

It's a good idea to recap changes with release notes. See [past release notes](https://github.com/Official-Husko/fork-of-chains/tree/main/docs/update).

Link the new release notes in the main [README page](https://github.com/Official-Husko/fork-of-chains/blob/main/README.md) as well.
