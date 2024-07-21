# ts-strict-setup
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FIntegerAlex%2Fts-strict-setup.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FIntegerAlex%2Fts-strict-setup?ref=badge_shield)


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

## Usage

To use the CLI tool, run the following command:

 `cd <project-name>` change the directory  
    ` npm run lint ` 

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

### Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

### License

This project is licensed under GPL-3.0. See the LICENSE file for details.


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FIntegerAlex%2Fts-strict-setup.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FIntegerAlex%2Fts-strict-setup?ref=badge_large)

### Contact

For questions or support, please contact inquiry.akshatkotpalliwar@gmail.com .