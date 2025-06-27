# 🚀 How to Submit Merge Requests

![Version: 1.0](https://img.shields.io/badge/Version-1.0-green) ![Last  Updated: 2025-06-27](https://img.shields.io/badge/Last%20Updated-27--06--2025-blue)

This is a full guide on how to create a merge request (pull request) into this repository.
There are two versions of this guide:
- **Simple**: For small changes (e.g., submitting a new quest, or text fixes)
- **Robust**: For larger contributions (e.g., engine code, multiple quests)

---

## ✨ Simple Merge Request

This guide lets you submit a merge request directly from the web UI—no installation required!

If you already use `git`, or want a more robust workflow, see the [Robust Guide](#robust-merge-request).

### 1️⃣ Fork the Repository

- Go to [the GitHub repo](https://github.com/Official-Husko/fork-of-chains)
- Click the **Fork** button at the top right
- Wait for the forking process to finish

### 2️⃣ Make Your Changes

- Navigate to `https://github.com/[YOUR_USERNAME]/fork-of-chains`
- Use the GitHub web interface to add or edit files:
  - **Add a new file:**
    1. Go to the directory (e.g., `project/twee/quest/[YOUR_USERNAME]`)
    2. Click **Add file** → **Create new file**
    3. Name your file (e.g., `my_quest.twee`) and paste your content
    4. Add a descriptive commit message (e.g., `New quest: My Quest`)
  - **Edit an existing file:**
    1. Navigate to the file (e.g., `project/twee/quest/init/custom.twee`)
    2. Click the **Edit** button (✏️)
    3. Make your changes and save with a descriptive commit message
  - **Add a new folder:**
    1. Go to the parent directory (e.g., `project/twee/quest`)
    2. Click **Add file** → **Create new file**
    3. Type your new folder name followed by `/` and a placeholder file (e.g., `[YOUR_USERNAME]/.gitkeep`)
    4. Commit as above

### 3️⃣ Create a Pull Request

- Go to [Pull Requests](https://github.com/Official-Husko/fork-of-chains/pulls)
- Click **New pull request**
- For the source branch, select your fork and branch (usually `main`)
- For the target branch, select `Official-Husko/fork-of-chains` and `main`
- Click **Compare & pull request**
- Fill in the details:
  - **Title:** e.g., `Water Well quest`
  - **Description:** e.g., `A new Lv15 normal quest in the vale that gives money.`
- Click **Create pull request** 🎉

### 4️⃣ Responding to Feedback

- You may receive feedback on your pull request (e.g., typo suggestions)
- Edit your files as needed (repeat step 2)
- Your pull request will update automatically!

### 5️⃣ Once Merged

- You’re done! Thank you for contributing! 🥳

---

## 🛠️ Robust Merge Request

This guide is for contributors who want to use `git` locally for more control.

### Prerequisites

- Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- (Recommended) Install [Visual Studio Code](https://code.visualstudio.com/download)

### 1️⃣ Fork the Repository

- Go to [the GitHub repo](https://github.com/Official-Husko/fork-of-chains) and click **Fork**

### 2️⃣ Clone Your Fork

```bash
git clone https://github.com/[YOUR_USERNAME]/fork-of-chains.git
cd fork-of-chains
```

- Add the main repo as upstream:

```bash
git remote add upstream https://github.com/Official-Husko/fork-of-chains.git
```

### 3️⃣ Update Your Fork

```bash
git pull upstream main
```

If you have local changes:
```bash
git stash
git pull upstream main
git stash pop
```

### 4️⃣ Make Your Changes

- Use your editor (e.g., VS Code) to add or edit files
- Commit your changes:

```bash
git add .
git commit -m "Added new quest: Water Well"
```

- Push to your fork:

```bash
git push origin main
```

### 5️⃣ Create a Pull Request

- Go to [Pull Requests](https://github.com/Official-Husko/fork-of-chains/pulls)
- Click **New pull request**
- Select your fork/branch as the source, and `Official-Husko/fork-of-chains`/`main` as the target
- Fill in the title and description
- Click **Create pull request**

### 6️⃣ Responding to Feedback

- You may receive feedback on your pull request
- Make changes as needed, commit, and push again—your pull request will update automatically

### 7️⃣ Once Merged

- You’re done! 🎉

### 8️⃣ Creating Another Pull Request

- Repeat steps 3–7 above for each new contribution

---

> 💡 **Tip:** For more info on compiling and testing the game, see the [README](https://github.com/Official-Husko/fork-of-chains#compiling-instructions).
