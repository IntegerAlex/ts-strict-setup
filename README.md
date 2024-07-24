# ts-strict-setup

<a href="https://pkg-size.dev/ts-strict-setup"><img src="https://pkg-size.dev/badge/bundle/2968" title="Bundle size for ts-strict-setup"></a>
![NPM Downloads](https://img.shields.io/npm/d18m/ts-strict-setup)
[![npm version](https://badge.fury.io/js/ts-strict-setup.svg)](https://badge.fury.io/js/ts-strict-setup)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![DeepScan grade](https://deepscan.io/api/teams/24419/projects/27609/branches/884364/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=24419&pid=27609&bid=884364)
[![DeepSource](https://app.deepsource.com/gh/IntegerAlex/ts-strict-setup.svg/?label=resolved+issues&show_trend=true&token=qa09V7tdZQUszg7bavL772dR)](https://app.deepsource.com/gh/IntegerAlex/ts-strict-setup/)

ts-strict-setup is a CLI tool that sets up a TypeScript project with a minimal yet well-configured environment in a single command.
Perfect for developers who want a quick and efficient way to get started with TypeScript.

## Features

- Creates a well-structured TypeScript project directory.
- Initializes a new npm project.
- Configures TypeScript, ESLint, and other essential development tools.
- Sets up commonly used directories and files.

## Installation

You can use npx to run the CLI tool without installing it globally:

### Using npx (recommended) Dont worry npx is already installed with npm

To use the CLI tool with npx:

`npx ts-strict-setup -y `

Run the command and follow the prompts:

`npx ts-strict-setup -y`

You will be prompted to enter a project name. The tool will then create a new project directory with the following structure:

```
<project-name>/
├── src/
│   └── index.ts
├── lib/
├── test/
│   └── index.test.ts
├── dist/
├── views/
│   └── index.html
├── .eslintignore
├── eslint.config.js
├── package.json
├── tsconfig.json

```

## conformation

```bash
    cd <project-name>
    npm run dev
```    

## Usage

To use the CLI tool, run the following command:

`cd <project-name>` change the directory  
 `npm run lint`

- To lint the code
  All the errors will be shown in the terminal

`npm run dev`

- To run the code in development mode
  The Dev mode run the code in .ts files with ts-node

`npm run build`

- To build the code the code will be built in the dist folder
  All the .ts files will be converted to .js files

`npm run start`

- To start the code
  The code will be run in the dist folder

`npm run test`

- The test will be run and the output will be shown in the terminal
  All the test files should be in the test folder and should have the extension .test.ts

## Configuration

The tool sets up the following configurations:

- TypeScript: Configured with tsconfig.json for modern JavaScript features and strict type-checking.
- ESLint: Configured with eslint.config.js and .eslintignore to enforce code quality and ignore unnecessary files.

### TypeScript Configuration

The tsconfig.json file includes settings for:

- ES6 modules
- Interoperability with CommonJS modules
- Strict type-checking
- Output directory (dist)

### ESLint Configuration

The eslint.config.js file includes:

- Basic TypeScript linting rules
- Configurations for using TypeScript with ESLint

## Tutorials

For a step-by-step guide, check out our YouTube tutorials:

### Linux-Based Tutorial

[![Linux Tutorial](https://img.youtube.com/vi/HNJo4Ak0MPs/0.jpg)](https://www.youtube.com/watch?v=HNJo4Ak0MPs)

### Windows-Based Tutorial

[![Windows Tutorial](https://img.youtube.com/vi/k4VH3dJIfpE/0.jpg)](https://www.youtube.com/watch?v=k4VH3dJIfpE)

### Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

### License

This project is licensed under GPL-3.0. See the LICENSE file for details.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FIntegerAlex%2Fts-strict-setup.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FIntegerAlex%2Fts-strict-setup?ref=badge_large)

### Contact

For questions or support, please contact inquiry.akshatkotpalliwar@gmail.com .
