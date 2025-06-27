# 📦 Installing NodeJS

You can install Node.js from the [official website](https://nodejs.org/en/). Choose the **LTS version** (usually on the left). This will download an installer for your system.

---

## 🐧 Linux

Most Linux distributions let you install Node.js and npm from your package manager. For example:

- **Debian/Ubuntu:**
  ```bash
  sudo apt update
  sudo apt install nodejs npm
  ```
- **Arch Linux:**
  ```bash
  sudo pacman -S nodejs npm
  ```
- **Fedora:**
  ```bash
  sudo dnf install nodejs npm
  ```

---

## 🪟 Windows

- Download the installer from the [Node.js website](https://nodejs.org/en/).
- Choose the **LTS version** and run the installer.
- Make sure to check the options to add Node.js to your PATH and include npm (enabled by default).
- For best results, install Node.js on your main hard drive (usually C:).

![Node.js installer options](https://i.imgur.com/uaXMM9k.png "Make sure to include npm and add to path!")

---

## ✅ Verifying Your Installation

Open a terminal or command prompt and run:

```bash
npm --version
```

If you see a version number, everything is set up! If you get a "command not found" error, Node.js or npm is not installed correctly or not in your PATH.
