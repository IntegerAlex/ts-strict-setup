#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

main();

async function main() {
  try {
    const projectName = await createProject();
    installDependencies(projectName);
    makeDirs(projectName);
    createFiles(projectName);
  } catch (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }
}

function createProject() {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter project name: ", (projectName) => {
      const trimmedName = projectName.trim();
      if (trimmedName) {
        const projectPath = path.join(process.cwd(), trimmedName);
        try {
          if (fs.existsSync(projectPath)) {
            console.log(`Directory '${trimmedName}' already exists.`);
            resolve(trimmedName);
          } else {
            fs.mkdirSync(projectPath);
            console.log(
              `Project directory '${trimmedName}' created successfully at ${projectPath}`,
            );
            resolve(trimmedName);
          }
        } catch (error) {
          console.error(`Failed to create project directory: ${error.message}`);
          reject(error);
        }
      } else {
        console.log("Project name cannot be empty.");
        reject(new Error("Project name cannot be empty."));
      }
      rl.close();
    });
  });
}

function installDependencies(projectName) {
  const projectPath = path.join(process.cwd(), projectName);
  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    packageJson(projectName),
  );
  execSync("npm install", { cwd: projectPath, stdio: "inherit" });
  execSync(
    "npm install --save-dev eslint @eslint/js @types/eslint__js typescript @typescript-eslint/eslint-plugin eslint-define-config ts-node --loglevel=error",
    { cwd: projectPath, stdio: "inherit" },
  );
}

function makeDirs(projectName) {
  const projectPath = path.join(process.cwd(), projectName);
  const dirs = ["src", "lib", "test", "dist", "views"];
  dirs.forEach((dir) => {
    fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
  });
}

function createFiles(projectName) {
  const projectPath = path.join(process.cwd(), projectName);
  fs.writeFileSync(path.join(projectPath, "src", "index.ts"), serve);
  fs.writeFileSync(path.join(projectPath, "test", "index.test.ts"), "");
  fs.writeFileSync(path.join(projectPath, "views", "index.html"), indexHtml);
  fs.writeFileSync(path.join(projectPath, "tsconfig.json"), tsconfig);
  fs.writeFileSync(path.join(projectPath, ".eslintignore"), eslintIgnore);
  fs.writeFileSync(path.join(projectPath, "eslint.config.js"), eslint);
}

const tsconfig = `{
  "compilerOptions": {
    "target": "ES6",
    "module": "ES6",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "strict": true,
    "skipLibCheck": true
  }
}
`;

const eslint = `// eslint.config.js
const { defineConfig } = require('eslint-define-config');
const tsEslintPlugin = require('@typescript-eslint/eslint-plugin');
const tsEslintParser = require('@typescript-eslint/parser');

module.exports = defineConfig([
    {
        languageOptions: {
            parser: tsEslintParser,
        },
        plugins: {
            '@typescript-eslint': tsEslintPlugin,
        },
        rules: {
            // Add your custom rules here
        },
    },{
        files: ['**/*.ts'],
    },
]);
`;

const eslintIgnore = `
# .eslintignore
node_modules/
dist/
`;

const packageJson = (projectName) => {
  return `{
        "name": "${projectName}",
        "version": "1.0.0",
        "description": "",
        "main": "src/index.js",
        "scripts": {
            "build": "tsc",
            "start": "node dist/src/index.js",
            "dev": "ts-node src/index.ts",
            "lint": "npx eslint ."
        },
        "keywords": [],
        "author": "",
        "license": "ISC"
    }`;
};
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ts-strict-setup</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        pre {
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
        code {
            font-family: 'Courier New', Courier, monospace;
        }
        img {
            max-width: 100px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
	<h1>Setup Complete</h1>

<h2>ts-strict-setup</h2>
<p>ts-strict-setup is a CLI tool that sets up a TypeScript project with a minimal yet well-configured environment in a single command. Perfect for developers who want a quick and efficient way to get started with TypeScript.</p>

<h2>Features</h2>
<ul>
    <li>Creates a well-structured TypeScript project directory.</li>
    <li>Initializes a new npm project.</li>
    <li>Configures TypeScript, ESLint, and other essential development tools.</li>
    <li>Sets up commonly used directories and files.</li>
</ul>

<h2>Installation</h2>
<p>You can use npx to run the CLI tool without installing it globally:</p>

<h3>Using npx (recommended)</h3>
<p>Don't worry, npx is already installed with npm.</p>
<p>To use the CLI tool with npx:</p>
<pre><code>npx ts-strict-setup -y</code></pre>

<p>Run the command and follow the prompts:</p>
<pre><code>npx ts-strict-setup -y</code></pre>

<p>You will be prompted to enter a project name. The tool will then create a new project directory with the following structure:</p>
<pre><code>&lt;project-name&gt;/
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
</code></pre>

<h2>Usage</h2>
<p>To use the CLI tool, run the following command:</p>
<pre><code>cd &lt;project-name&gt;  <!-- change the directory -->
npm run lint</code></pre>
<p>To lint the code, all the errors will be shown in the terminal.</p>
<pre><code>npm run dev</code></pre>
<p>To run the code in development mode. The Dev mode runs the code in .ts files with ts-node.</p>
<pre><code>npm run build</code></pre>
<p>To build the code. The code will be built in the dist folder. All the .ts files will be converted to .js files.</p>
<pre><code>npm run start</code></pre>
<p>To start the code. The code will be run in the dist folder.</p>
<pre><code>npm run test</code></pre>
<p>The tests will be run and the output will be shown in the terminal. All the test files should be in the test folder and should have the extension .test.ts.</p>

<h2>Configuration</h2>
<p>The tool sets up the following configurations:</p>
<ul>
    <li>TypeScript: Configured with tsconfig.json for modern JavaScript features and strict type-checking.</li>
    <li>ESLint: Configured with eslint.config.js and .eslintignore to enforce code quality and ignore unnecessary files.</li>
</ul>

<h3>TypeScript Configuration</h3>
<p>The tsconfig.json file includes settings for:</p>
<ul>
    <li>ES6 modules</li>
    <li>Interoperability with CommonJS modules</li>
    <li>Strict type-checking</li>
    <li>Output directory (dist)</li>
</ul>
<img src="https://raw.githubusercontent.com/github/explore/main/topics/typescript/typescript.png" alt="TypeScript Logo">

<h3>ESLint Configuration</h3>
<p>The eslint.config.js file includes:</p>
<ul>
    <li>Basic TypeScript linting rules</li>
    <li>Configurations for using TypeScript with ESLint</li>
</ul>
<img src="https://raw.githubusercontent.com/github/explore/main/topics/eslint/eslint.png" alt="ESLint Logo">

<h2>Repository Link</h2>
<p>For more information, visit the <a href="https://github.com/IntegerAlex/ts-strict-setup">ts-strict-setup repository</a> on GitHub.</p>

<h2>Contributing</h2>
<p>Contributions are welcome! Please open an issue or submit a pull request on GitHub.</p>

<h2>License</h2>
<p>This project is licensed under GPL-3.0. See the LICENSE file for details.</p>

<h2>Contact</h2>
<p>For questions or support, please contact <a href="mailto:inquiry.akshatkotpalliwar@gmail.com">inquiry.akshatkotpalliwar@gmail.com</a>.</p>

<h2>Tutorial Videos</h2>
<p>Watch the tutorial videos for a step-by-step guide on how to use ts-strict-setup:</p>
<ul>
    <li><a href="https://www.youtube.com/watch?v=HNJo4Ak0MPs">Linux Tutorial</a></li>
    <li><a href="https://www.youtube.com/watch?v=k4VH3dJIfpE">Windows Tutorial</a></li>
</ul>

</body>
</html>
`;

const serve = `
const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req: any, res: any) => {
  fs.readFile(path.join(__dirname, '../views/index.html'), (err: NodeJS.ErrnoException | null, data: Buffer) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
}).listen(3000, () => console.log('Server running at \x1b[36m%s\x1b[0m', 'http://localhost:3000'));
`;
