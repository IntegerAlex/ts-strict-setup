#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

main();

async function main(){
    try {
        const projectName = await createProject();
        installDependencies(projectName);
        makeDirs(projectName);
        createFiles(projectName);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

function createProject() {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Enter project name: ', projectName => {
            const trimmedName = projectName.trim();
            if (trimmedName) {
                const projectPath = path.join(process.cwd(), trimmedName);
                try {
                    if (fs.existsSync(projectPath)) {
                        console.log(`Directory '${trimmedName}' already exists.`);
                        resolve(trimmedName);
                    } else {
                        fs.mkdirSync(projectPath);
                        console.log(`Project directory '${trimmedName}' created successfully at ${projectPath}`);
                        resolve(trimmedName);
                    }
                } catch (error) {
                    console.error(`Failed to create project directory: ${error.message}`);
                    reject(error);
                }
            } else {
                console.log('Project name cannot be empty.');
                reject(new Error('Project name cannot be empty.'));
            }
            rl.close();
        });
    });
}

function installDependencies(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    fs.writeFileSync(path.join(projectPath, 'package.json'), packageJson(projectName));
	execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
    execSync('npm install --save-dev eslint @eslint/js @types/eslint__js typescript @typescript-eslint/eslint-plugin eslint-define-config ts-node --loglevel=error', { cwd: projectPath, stdio: 'inherit' });
}

function makeDirs(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    const dirs = ['src', 'lib', 'test', 'dist', 'views'];
    dirs.forEach(dir => {
        fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
    });
}

function createFiles(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    fs.writeFileSync(path.join(projectPath, 'src', 'index.ts'), '');
    fs.writeFileSync(path.join(projectPath, 'test', 'index.test.ts'), '');
    fs.writeFileSync(path.join(projectPath, 'views', 'index.html'), '');
    fs.writeFileSync(path.join(projectPath, 'tsconfig.json'), tsconfig);
    fs.writeFileSync(path.join(projectPath, '.eslintignore'), eslintIgnore);
    fs.writeFileSync(path.join(projectPath, 'eslint.config.js'), eslint);
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
}

