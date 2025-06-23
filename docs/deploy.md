# Test / Deployment Guide

This guide details deployment process for the game.
To deploy, you must first [install NodeJS](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/javascript.md).

The deployment process consist of several steps:

- Test
- Increase version number
- Build the precompiled version
- Optionally, build the zip version to upload on itch.io

These three steps are detailed as follows:

## Test

The game has a semi-automated testing built into the game:

1. [Compile the game](docs/javascript.md)
2. Open the game, then from the main menu, select `(Debug start)`
3. Go to `Settings`
4. Scroll down and select `(TEST EVERYTHING)`
5. Wait for a few minutes until the testing is completed
6. Open the Javascript Console (e.g., `Ctrl + Shift + J`), and look for errors there
7. If you found an error there, you can do a search in the page
(not in the javascript console) for `error`. This should lead you to the particular quest /
content that has problems.

This test will try and run all quest, opportunity, event, interaction, epilogue, activity, and more.
This will usually cover the entire code base, so if the test succeed, the game is likely to be
in a good state.

If you have `npm` installed, the game also has a sanity checking that spots various common mistakes.
You can run it with `npm run sanity`.

## Increasing version number

- The first step depends on your OS:
  - Windows:
    - Execute `update.bat` to bump micro version (e.g., 1.8.2.3 to 1.8.2.4)
    - Execute `updatepatch.bat` to bump patch version (e.g., 1.8.2.3 to 1.8.3.0)
    - Execute `updateminor.bat` to bump minor version (e.g., 1.8.2.3 to 1.9.0.0)
    - Execute `updatemajor.bat` to bump major version (e.g., 1.8.2.3 to 2.0.0.0)
  - Linux:
    - Run `npm run set-version bump` to bump micro version (e.g., 1.8.2.3 to 1.8.2.4)
    - Run `npm run set-version bump-patch` to bump patch version (e.g., 1.8.2.3 to 1.8.3.0)
    - Run `npm run set-version bump-minor` to bump minor version (e.g., 1.8.2.3 to 1.9.0.0)
    - Run `npm run set-version bump-major` to bump major version (e.g., 1.8.2.3 to 2.0.0.0)

- The command above will automatically update `changelog.txt` (https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/changelog.txt), and you need to update this file.

## Building the precompiled version

- Windows:
  - Execute `precompile.bat`
- Linux:
  - Run: `npm run precompile`

This will automatically update the `dist` folder with the latest precompiled version.

## Building the full zip version

Please note this may take a while.

- Windows:
  - Execute `deployfull.bat`
- Linux:
  - Run: `npm run deployfull`

This will generate a `focfull.zip` containing the full game with all images.

## Building the itch.io zip version

- Windows:
  - Execute `deployitch.bat`
- Linux:
  - Run: `npm run deployitch`

This will generate a `focitch.zip` containing the game version suitable to be played
on browser in itch.io.
Note that itch.io has a strict requirement of "at most 1000 files".
To reduce the number of files, you can remove some of the unit images found in the `dist`
folder.
The easiest way to do this is to download a previous version from `itch.io`,
then override the `dist/imagepacks` folder with the one from the previous `itch.io` version.

## Release notes and documentation

It might be good to recap the changes with a release notes. See
https://gitgud.io/darkofocdarko/fort-of-chains/-/tree/master/docs/update for past
release notes.

You want to link the new release notes in the main
README page too: https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/README.md

