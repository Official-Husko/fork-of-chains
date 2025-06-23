## Compiling Javascript Files

During a full build of the project, two steps are run:
 1. Compilation of all the `.js` (javascript code) and `.css` (style) files into a pair of bundle files (`generated/dist/user.min.js` and `generated/dist/user.min.css`)
 2. Compilation of the `.twee` files together with this js/css bundle, using tweego, into the final `dist/index.html`

### Full build (JS/CSS & Twee)

First of all, you will need to have a recent version of [NodeJS](https://nodejs.org/en) installed, to be able to run the `node` and `npm` commands.

Then you'll need to open a terminal or command prompt to run the following commands. Note that all commands are to be run from the root directory of the repository (the folder containing the package.json file).

The first time you are building the project (an in the rare occasion where they change), you will need to install the project dependencies with the following command:
```
npm install
```

Then, you can run the following command:
```
npm run build
```
This will compile both the js+css and the twee files, and generate the final `dist/index.html` file, which can be opened in the browser to play the game.

The command above will generate a "debug" build of the game. You can instead run one of the following commands to generate different build depending on what you want:

- Build a debug version of the game: `npm run build`

Also note that the intermediate js+css bundles are generated in different folders depending on the mode:
- For production builds: `generated/dist/user.min.js` and `generated/dist/user.min.css`
- For debug builds: `generated/debug/user.min.js` and `generated/debug/user.min.css`

### Compile only Twee

If you only want to compile the .twee files, you don't need to have NodeJS installed. You can just run either `./compile.sh` (linux / macOS), or `./compile.bat` (Windows).

By default this will compile using the production js+css bundle at `generated/dist/`, you can add the "debug" argument to use instead the development bundle at `generated/debug/`. For example:
```
./compile.sh debug
``````

## Devmode (experimental)

You can run `npx vite dev` to start an interactive development server. Once ready, you can access the game at `http://localhost:3100`.
In this mode, changes to js and css files will retrigger an hotreload, and for CSS styles and JSX components they _might_ reload instantaneaously with the updated code without needing a full page reload.

However, some things may broke as the codebase is not fully ready to support it properly. Even so, it is very useful for testing UI changes.

## Version bump, precompiling, and deploying

Please check [Deployment Guide](docs/deploy.md).
