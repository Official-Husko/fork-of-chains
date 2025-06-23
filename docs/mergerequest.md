# How to Submit Merge Requests

This is a full guide how to create a merge request into this repository.
There are two versions of this guide, the [Simple](#simple-merge-request) one if your changes is fairly small
(e.g., just submitting a new quest, or some text fixes), and the [Robust](#robust-merge-request) one if you are hoping to contribute more to the project (e.g., changing the engine code, or submitting multiple quests).

## Simple Merge Request

This guide will not require you to install anything, and just push the merge request directly from
the web UI!

If you have already installed `git`, or if you are looking for a more robust option, see
[robust guide](#robust-merge-request).

1. First, fork the repository:

  - Create a gitgud.io account if you have not already, and log in.
  - Navigate to [this page](https://gitgud.io/darkofocdarko/fort-of-chains)
  - On the top right corner of this page, click the "Fork" button ![fork](docs/img/fork.png)
  - Click the "Select" button under your username
  - Wait until the forking process is complete (this may take a few minutes)

2. Make changes to the repository:
  - Navigate to https://gitgud.io/[YOUR_USERNAME]/foc, where [YOUR_USERNAME] is your gitgud.io username. (If you are following this tutorial, then you should already be at this page.)
  - Use the gitgud.io GUI interface to add your changes to the game:
    - To add a new file:
      - Navigate to the directory where your file should reside, e.g., "project/twee/quest/[YOUR_USERNAME]".
      - Click on the [+] button next to the directory name ![button](docs/button.png)
      - Select "New file". Put the file name, e.g., "my_quest.twee", and paste in your content there. As the commit message, put something descriptive again, e.g., "New quest: My Quest".
    - To edit an existing file:
      - Navigate to the file, e.g, to "project/twee/quest/init/custom.twee"
      - Click the Edit button right above the content of this file ![edit](docs/img/edit.png)
      - Edit the file.
      - Once you're done, save the file. For the commit message, put something descriptive.
    - To add a new folder / directory:
      - Navigate to the parent directory. For example, go to "project/twee/quest"
      - Click the [+] button in this page next to the directory name ![button](docs/button.png)
      - Select "New directory". Put the directory name, e.g., [YOUR_USERNAME]. As the commit message, you can put something descriptive, for example, "New quest directory for [YOUR_USERNAME]".

3. Create merge request:
  - Navigate back to [https://gitgud.io/darkofocdarko/fort-of-chains](https://gitgud.io/darkofocdarko/fort-of-chains)
  - From the menu on the left sidebar, select "Merge Requests" ![button](docs/img/merge.png)
  - Click new merge request ![button](docs/img/newmerge.png)
  - For the source branch, select your fork, and the branch named "master"
  
   ![mergebranch](docs/img/mergebranch.png)

  - For the target branch, select `darkofocdarko/fort-of-chains`, and `master`.
  - Click `Compare branches and continue`
  - Write in the details of your merge request
    - For example, in the title, you can write "Water Well quest"
    - In the description, you can write: "A new Lv15 normal quest in the vale that give money."
  - Click "Submit merge requests", and you are done!

4. Responding to feedbacks:
  - You can receive feedbacks for your merge requests --- for example, someone could point out that there is a typo in your quest.
  - Navigate back to https://gitgud.io/[YOUR_USERNAME]/foc (replace YOUR_USERNAME with your gitgud.io username)
  - Repeat steps in (2) above to edit your files.
  - Nothing else needs to be done, your merge request will automatically be updated!

5. Once your merge request is committed, delete your fork:
  - Navigate back to https://gitgud.io/[YOUR_USERNAME]/foc (replace YOUR_USERNAME with your gitgud.io username)
  - Click settings in the bottom right corner of the sidebar, and then to General ![general](docs/img/general.png)
  - Scroll to the bottom, and click the `Expand` button on `Advanced`
  - Scroll to the bottom again, and click `Delete project` ![delete](docs/img/delete.png)
  - Follow the instructions on the screen, and then click `Yes, delete project`
  - Congratulations, you can now repeat again from step (1) to get another merge request
  - Alternatively, you can follow the guide below which makes it much easier in the long run to add many merge requests, since you don't have to keep deleting the project each time


## Robust Merge Request

This guide will require you to install `git`.
Please see [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) for instructions
how to install git.

It is also highly recommended to install a robust text-editor with built-in git support,
for easier time editing the files.
One recommended option is the free [Visual Studio Code](https://code.visualstudio.com/download),
which among other things supports the SugarCube 2 syntax, which is used in this project.

Once you have both `git` and preferably `Visual Studio Code` installed, continue reading the tutorial.

1. First, fork the repository:

  - Create a gitgud.io account if you have not already, and log in.
  - Navigate to [this page](https://gitgud.io/darkofocdarko/fort-of-chains)
  - On the top right corner of this page, click the "Fork" button ![fork](docs/img/fork.png)
  - Click the "Select" button under your username
  - Wait until the forking process is complete (this may take a few minutes)

2. Clone your fork into your computer:
  - Navigate to https://gitgud.io/[YOUR_USERNAME]/foc, where [YOUR_USERNAME] is your gitgud.io username. (If you are following this tutorial, then you should already be at this page.)
  - Click the `Clone` button, and then copy the url under `https` by clicking the copy button next to it:
  ![clone](docs/img/clone.png)

  - Open `git`, and navigate to a directory of your choosing. This is where the game files will be stored
  for you to edit later.

    - Windows

      To do this via `git bash`, use the `cd` command. For example:

      ```
        cd "C:\project"
      ```

      Will move to folder `project` in your C partition (make sure to create the folder first!)

    - Linux

      Use `cd` command in terminal. For example:

      ```
      cd ~/project
      ```

      Will move to a folder called `project` in your home directory (make sure to create the folder first!)

  - Clone the repository by running:

  ```
    git clone https://gitgud.io/[YOURUSERNAME]/foc
  ```

  (The url above should be copied from earlier, just paste it in there.)

  - Wait until the download is complete (may take 10 minutes or so).

  - Navigate into the resulting folder named `foc`, e.g., by typing:

  ```
    cd foc
  ```

  - Add "upstream" branch by running:

  ```
    git remote add upstream https://gitgud.io/darkofocdarko/fort-of-chains.git
  ```

3. Update version to master

  - Update your version of files:

  ```
  git pull upstream master
  ```

    - If git complains something like "You have local changes, commit them first!", then instead do:

      ```
      git stash
      git pull upstream master
      git stash pop
      ```

4. Edit your files
  - If you are using `Visual Studio Code`:
    - (Optional) Install extension:
      - Sugarcube2 by Cherrybomb67 (for editing sugarcube files, don't install the other two)

    - Click `File`, then `Open Folder...`, and select the `foc` folder created by `git` earlier.

  - Change your files! Add your quest, edit the files to your liking, etc. This should be where the bulk of your time will be spent.

5. Test your game!
  - [Compile the game](https://gitgud.io/darkofocdarko/fort-of-chains#compiling-instructions)
  - Open `dist/index.html` and test the game! (Don't mistakenly open `dist/precompiled.html`)

5. Commit your changes to your fork

  - Add the changes to be committed:
    - If you are using `Visual Studio Code`, navigate to the `Source Control` menu ![source](docs/img/source.png)
      - Click the [+] button next to `Changes` ![plus](docs/img/plus.png)
      - Write in a commit message describing your changes, then click the `Commit` button ![commit](docs/img/commit.png)
    - If you are not using `Visual Studio Code`,

      ```
      git add .
      git commit -m 'Added new quest: Water well'
      ```

  - Push to your fork

  ```
    git push origin master
  ```

6. Create a merge request

  - Navigate back to [https://gitgud.io/darkofocdarko/fort-of-chains](https://gitgud.io/darkofocdarko/fort-of-chains)
  - From the menu on the left sidebar, select "Merge Requests" ![button](docs/img/merge.png)
  - Click new merge request ![button](docs/img/newmerge.png)
  - For the source branch, select your fork, and the branch named "master"
  
   ![mergebranch](docs/img/mergebranch.png)

  - For the target branch, select `darkofocdarko/fort-of-chains`, and `master`.
  - Click `Compare branches and continue`
  - Write in the details of your merge request
    - For example, in the title, you can write "Water Well quest"
    - In the description, you can write: "A new Lv15 normal quest in the vale that give money."
  - Click "Submit merge requests", and you are done!

7. Responding to feedbacks:
  - You can receive feedbacks for your merge requests --- for example, someone could point out that there is a typo in your quest.
  - Repeat steps (4) and (5) above.
  - Nothing else needs to be done, your merge request will automatically be updated!

8. Once your merge request is accepted
  - You are done!

9. Creating another merge request
  - Repeat step (3) to (8) in the above.
